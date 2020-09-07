# tailwind-cascade
<a href="https://www.npmjs.com/package/@mariusmarais/tailwind-cascade"><img src="https://img.shields.io/npm/v/@mariusmarais/tailwind-cascade.svg" alt="NPM"></a>

An attempt at making composable components possible using [TailwindCSS](https://tailwindcss.com/).

## Install

```sh
npm install @mariusmarais/tailwind-cascade --save
```

## Why?

TailwindCSS is amazing, but using it to create component libraries is difficult due to the CSS cascade. ([See](https://github.com/tailwindlabs/tailwindcss/discussions/1446) [some](https://github.com/tailwindlabs/tailwindcss/discussions/1951) [discussions](https://github.com/tailwindlabs/tailwindcss/discussions/2187).)

Normally you would only use the specific Tailwind classes you need (that's the point), but when you're building a reusable component, you run into trouble with overriding some styles.

You could:

* use completely unstyled base components like [Tailwind React UI](https://github.com/emortlock/tailwind-react-ui) and style them one-by-one,
* use CSS-in-JS to handle overriding has part of the build (I hear good things about [Twin](https://github.com/ben-rogerson/twin.macro)),
* or throw caution to the wind and use this lib.

## Usage

The `twCascade` function wraps [classnames](https://github.com/JedWatson/classnames) and supports all its standard usage patterns.

Create a base component with some Tailwind classes, wrapping the `className` with `twCascade` while letting the caller's `className` pass through:

```ts
// Example in React, but twCascade should work everywhere

import React, { FC, DetailedHTMLProps, ButtonHTMLAttributes } from 'react';

import { twCascade } from '@mariusmarais/tailwind-cascade';

interface MyButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  setActive?: boolean;
  canHover?: boolean;
}

const MyButton: FC<MyButtonProps> = props => {
  const { disabled, className, children, ...other } = props;

  const activeClasses = ['border-gray-500', 'bg-gray-500', 'text-white'];
  const hoverClasses = ['border-gray-700', 'bg-gray-700 ', 'text-white'];

  return (
    <button
      className={twCascade(
        'text-sm',
        'w-32',
        'border',
        'border-gray-300',
        'rounded-md',
        disabled && 'cursor-default',
        !disabled && !setActive && activeClasses.map(n => `active:${n}`),
        !disabled && canHover && hoverClasses.map(n => `hover:${n}`),
        setActive && activeClasses,
        !setActive && 'text-gray-900',
        className
      )}
      disabled={disabled}
      {...other}
    >
      {children}
    </button>
  );
};
```

In your app, create three buttons, two in a classic button group, the other on its own:

```ts
render() {
  return (
    <>
      <MyButton
        setActive={direction === 'left'}
        disabled={direction === 'left'}
        className="w-24 border-r-0 rounded-r-none"}
      >
        Left
      </MyButton>

      <MyButton
        setActive={direction === 'right'}
        disabled={direction === 'right'}
        className="w-24 border-l-0 rounded-l-none"}
      >
        Inbound
      </MyButton>

      <MyButton className="ml-10">Go</MyButton>
    </>
  );
}
```

Usually the duplicate width and border options can cause trouble, but not anymore.

### Advanced

Use `const twCascade = createTailwindCascader({prefix: 'some-tw-prefix-'})` if your Tailwind classes have a prefix.

## How does it work?

Pretty well, considering none of it was supposed to work this way...

All Tailwind classes are broken down into groups, like `.object-bottom`, `.object-center`, `.object-left`, and so on. Only the last class defined per group is kept.

For 90% of Tailwind this works very well, for the other 9.9% additional overrides are configured to allow cross-group overriding, such as `.rounded-r` overriding `.rounded-tr` & `.rounded-br`, and `.rounded` overriding all the other `.rounded-*` classes. (The other way around just works, since Tailwind generates more-specific CSS classes after more general ones, meaning the normal cascade works in your favor.)

It shouldn't be necessary to re-specify additional classes to override previous overrides, but hey, at least it's possible.

[YMMV](https://en.wiktionary.org/wiki/your_mileage_may_vary)

## Contributing

PLEASE HELP. Open an issue, and we figure it out.

Ideally, much smarter people than I can do away with the manual group definitions, simplify the build steps, and get rid of the unprofessional tone in the README.

Maybe there's a way for the TailwindCSS authors to make this lib simpler, or make it absolete. One can dream.

## But this is a terrible idea!

Perhaps.
