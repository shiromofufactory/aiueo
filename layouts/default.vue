<template lang="pug">
nuxt
</template>
<style lang="sass">
$grid-breakpoints: (xs: 0, sm: 576px)
$grid-columns: 6
$font: "ヒラギノ丸ゴ Pro W4","ヒラギノ丸ゴ Pro","Hiragino Maru Gothic Pro","ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","HG丸ｺﾞｼｯｸM-PRO","HGMaruGothicMPRO";
@function breakpoint-min($name, $breakpoints: $grid-breakpoints)
  $min: map-get($breakpoints, $name)
  @return if($min != 0, $min, null)

=media-breakpoint-up($name, $breakpoints: $grid-breakpoints)
  $min: breakpoint-min($name, $breakpoints)
  @if $min
    @media (min-width: $min)
      @content
  @else
    @content

@function breakpoint-infix($name, $breakpoints: $grid-breakpoints)
  @return if(breakpoint-min($name, $breakpoints) == null, "", "-#{$name}")

*,
*::before,
*::after
  box-sizing: border-box

html
  -webkit-text-size-adjust: 100%
  -webkit-tap-highlight-color: rgba(0,0,0, 0)

body
  margin: 0
  font-family: $font
  font-size: 1rem
  line-height: 1.15
  color: #212529
  text-align: center
  background: url("/back.jpg")

h1
  margin: 0 0 1rem

h2
  margin: 0 0 1rem
  font-size: 1.2rem

p
  text-align: left
  font-size: 0.9rem
  color: #343a40
  margin: 0 0 1rem

img
  max-width: 100%

button
  padding: 0
  background: transparent
  border: none
  cursor: pointer
  &:focus
    outline: 0


.container
  margin: 0 auto
  padding: 1rem
  width: 100%
  max-width: 1080px
  min-height: 100vh

.row
  display: flex
  flex-wrap: wrap
  margin: 0 -1rem

@each $breakpoint in map-keys($grid-breakpoints)
  $infix: breakpoint-infix($breakpoint, $grid-breakpoints)

  @for $i from 1 through $grid-columns
    .col#{$infix}-#{$i}
      position: relative
      width: 100%
      padding: 0 1rem

  +media-breakpoint-up($breakpoint, $grid-breakpoints)
    @for $i from 1 through $grid-columns
      .col#{$infix}-#{$i}
        flex: 0 0 percentage($i / $grid-columns)
        max-width: percentage($i / $grid-columns)

.header
  position: sticky
  top: 0
  z-index: 1

.note
  display: inline-block
  vertical-align: bottom
  font-size: 0.8rem
  color: #343a40
  text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff, 0px 1px 0 #fff,  0-1px 0 #fff, -1px 0 0 #fff, 1px 0 0 #fff

.about
  position: fixed
  display: flex
  justify-content: center
  align-items: center
  text-align: center
  left: 0
  top: 0
  height: 100%
  width: 100%
  z-index: 9999
  background: rgba(0, 0, 0, 0.4)
  > .message
    margin: 0 1rem
    padding: 1rem
    border-radius: 0.4rem
    width: 100%
    background: #fff
    position: relative
    box-shadow: 0 0.125rem 0.25rem rgba(#000, 0.2)
    > .close
      position: absolute
      top: 0
      right: 1rem
      font-size: 2rem
      font-weight: bold
      color: #000
      text-shadow: 0 1px 0 #fff
      opacity: .5

.v-enter-active,
.v-leave-active
  transition: opacity 0.2s

.v-enter,
.v-leave-to
  opacity: 0

.flex
  display: flex
  flex-wrap: wrap

.mb-1
  margin-bottom: 1rem

.savebox
  height: 3rem
  margin-right: 1rem
  padding: 10px
  border-radius: 0.4em
  border: solid 1px #212529
  background-color: #fff
  flex-grow: 1
  max-width: calc(100% - 5rem)
  box-shadow: 0 0.125rem 0.25rem rgba(#000, 0.2)
  display: flex
  flex-direction: row
  .content
    font-size: 1.8rem
    line-height: 1.8rem
    height: 28px
    flex-grow: 1
    max-width: calc(100% - 2rem)
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    &.clear-next
      color: #e19a97
  > button
    display: inline-block
    float: right
    height: 28px
    width: 40px
    cursor: pointer
    > img
      height: 28px
      width: 40px

.speech
  border-radius: 0.4rem
  border: outset
  display: block
  height: 3rem
  width: 4rem
  padding: 0.5rem
  background-color: #fff
  > img
    margin-top: -3px
    height: 2rem
    width: 2rem

.action
  cursor: pointer
  -webkit-transition: all .1s
  transition: all .1s
  &:active,&:hover
    border: inset
    background-color: #89d1fb

.one-letter
  padding: 0.1rem
  width: 20%
  color: #212529
  border-radius: 0.4rem
  border: outset
  display: block
  height: 3rem
  font-family: $font
  font-size: 1.8rem
  line-height: 2.8rem
  font-weight: bold
  text-align: center
  background-color: #f8f9fa
  opacity: 0.9
  &.switch
    background-color: #e0ea9b
    font-size: 0.8rem
  &:not(.action)
    background-color: transparent
    border: none
    cursor: default

footer
  display: block
  position: sticky
  top: 100%
  margin-top: 1rem
  > a
    display: inline-block
    margin: 0 0 1rem 1rem
    float: right
    text-decoration: none
    font-size: 0.8rem
    color: #3fb4f8
    text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff, 0px 1px 0 #fff,  0-1px 0 #fff, -1px 0 0 #fff, 1px 0 0 #fff
</style>
