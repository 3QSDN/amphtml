/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview This file implements the `gulp test-report-upload` task, which POSTs test result reports
 * to an API endpoint that stores them in the database.
 */

'use strict';

const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
const {
  ciBuildId,
  ciBuildUrl,
  ciJobId,
  ciJobUrl,
  ciCommitSha,
  ciRepoSlug,
} = require('../common/ci');
const {log} = require('../common/logging');

const {cyan, green, red, yellow} = require('ansi-colors');

const REPORTING_API_URL = 'https://amp-test-cases.appspot.com/report';

/**
 * Parses a test report file and adds build & job info to it.
 * @param {('unit' | 'integration' | 'e2e')} testType The type of the tests whose result we want to report.
 * @return {Object.<string,Object>|null} Object containing the build, job, and test results.
 */
async function getReport(testType) {
  try {
    const report = await fs
      .readFile(`result-reports/${testType}.json`)
      .then(JSON.parse);

    return addJobAndBuildInfo(testType, report);
  } catch (e) {
    log(red('ERROR:'), 'Error getting test result report.\n', e.toString());

    return null;
  }
}

/**
 * Adds job and build info to a report.
 * @param {('unit' | 'integration' | 'e2e')} testType The type of the tests whose result we want to report.
 * @param {Object} reportJson The Json report generated by Karma.
 * @return {Object.<string,Object>} Object containing the build, job, and test results.
 */
function addJobAndBuildInfo(testType, reportJson) {
  const buildId = ciBuildId();
  const commitSha = ciCommitSha();
  const jobId = ciJobId();

  if (!buildId || !commitSha || !jobId) {
    throw new ReferenceError('CI fields are not defined.');
  }

  // (TODO ampproject/amp-github-apps/pull:1194) Update field names in database.
  return {
    repository: ciRepoSlug(),
    results: reportJson,
    build: {
      buildId,
      commitSha,
      url: ciBuildUrl(),
    },
    job: {
      jobId,
      testSuiteType: testType,
      url: ciJobUrl(),
    },
  };
}

/**
 * Sends a single report to the API endpoint for storage.
 * @param {('unit' | 'integration' | 'e2e')} testType The type of the tests whose result we want to report.
 */
async function sendCiKarmaReport(testType) {
  const body = await getReport(testType);

  if (!body) {
    return;
  }

  const response = await fetch(REPORTING_API_URL, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  });

  if (response.ok) {
    log(
      green('INFO:'),
      `Test results of type`,
      cyan(testType),
      'reported to',
      cyan(REPORTING_API_URL)
    );
  } else {
    log(
      yellow('WARNING:'),
      'failed to report results of type',
      cyan(testType),
      ': \n',
      yellow(await response.text())
    );
  }
}

/**
 * Uploads every report to the API endpoint for storage.
 */
async function testReportUpload() {
  const filenames = await fs.readdir('result-reports/');
  const testTypes = filenames.map((filename) => path.parse(filename).name);

  await Promise.all(testTypes.map(sendCiKarmaReport));
}

module.exports = {
  testReportUpload,
};

testReportUpload.description = 'Sends test results to test result database';
