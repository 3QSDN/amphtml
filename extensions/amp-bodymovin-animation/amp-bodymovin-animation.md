---
$category@: media
formats:
  - websites
teaser:
  text: Displays an AirBnB Bodymovin animation player.
---

<!---
Copyright 2018 The AMP HTML Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS-IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# amp-bodymovin-animation

## Usage

The `<amp-bodymovin-animation>` component embeds an [AirBnB Bodymovin animation player](http://airbnb.io/lottie/), which renders an animation from JSON generated by [Adobe After Effects](https://www.adobe.com/products/aftereffects.html).

The `width` and `height` attributes determine the aspect ratio of the animation embedded in responsive layouts.

```html
<amp-bodymovin-animation
  layout="fixed"
  width="200"
  height="200"
  src="https://nainar.github.io/loader.json"
  loop="5"
>
</amp-bodymovin-animation>
```

## Attributes

### `src`

The path to the exported Bodymovin animation object. Must be `https` protocol.

### `loop` (optional)

Indicates whether the animation should be looping or not. By default, this
attribute is set to `true`. Values for this attribute can be: `true`, `false`,
or a number value. If a number is specified, the animation loops that number of
times.

### `noautoplay` (optional)

By default, an animation autoplays. If this attribute is added the video waits
for an action to start playing.

### `renderer` (optional)

By default, this component uses the SVG renderer, this uses a light version of
the Bodymovin animation player. However, if developers feel that they need the
full player and want to use an HTML renderer they may do so by specifying the
`renderer` attribute to be `html`.

This attribute only accepts the values `html` and `svg`.

### title (optional)

Define a `title` attribute for the component to propagate to the underlying `<iframe>` element. The default value is `"Airbnb BodyMovin animation"`.

### Common attributes

This element includes [common attributes](https://amp.dev/documentation/guides-and-tutorials/learn/common_attributes)
extended to AMP components.

## Actions

### `play`

Plays the animation.

### `pause`

Pauses the animation.

### `stop`

Stops the animation.

### `seekTo(time=INTEGER)`

Sets the `currentTime` of the animation to the specified value and pauses
animation.

### `seekTo(percent=[0,1])`

Uses the given percentage value to determine the `currentTime` of the animation
to the specified value and pauses animation.

## Validation

See [amp-bodymovin-animation rules](validator-amp-bodymovin-animation.protoascii) in the AMP validator specification.
