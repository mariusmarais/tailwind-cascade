import { flatten } from "lodash";
import expand from "brace-expansion";

/** Expand brace expressions */
function x(...patterns: string[]): string[] {
  return flatten(patterns.map(expand));
}

/*
 * A note about overrides:
 * Tailwind's CSS is generated so that more specific classnames typically can override
 * more general ones. Eg.: for rounded corners, the order is:
 *   - rounded
 *   - rounded-t  | rounded-r  | etc.
 *   - rounded-tl | rounded-tr | etc.
 *
 * Due to the normal CSS cascade, this means more-specific things win, typically exactly
 * what you want.
 *
 * But if `rounded` is specified **after** `rounded-r`, we want `rounded` to win.
 * Since they're in different groups, this won't happen automatically, so we define
 * an override, so the helper knows that a `rounded` found after `rounded-r` should
 * remove the `rounded-r` and so on.
 *
 * There aren't many of these, mostly around borders, and anywhere `x` & `y` versions
 * can be specified.
 */

export const Override = Symbol();

export type DefinitionNode<T> = {
  [n: string]: T | DefinitionNode<T>;
  [Override]?: {
    [n: string]: string[];
  };
};

// TODO: Can this come from the tailwind config?
// TODO: Pull out more shared parts
const Standard = {
  Size: {
    Numbers: "{0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,56,64}",
    names: "{xs,sm,md,lg,{,{2..6}}xl}",
  },
  Ratios: "{1/2,{1..2}/3,{1..3}/4,{1..4}/5,{1..5}/6,{1..11}/12}",
  Screens: "{sm,md,lg,xl}",
  Colors:
    "{transparent,current,black,white,{{,cool-}gray,red,orange,yellow,green,teal,blue,indigo,purple,pink}-{50,{100..900..100}}}",
  Opacities: "{0,25,50,75,100}",
  Durations: "{75,100,150,200,300,500,700,1000}",
  Scales: "{0,50,75,90,95,100,105,110,125,150}",
};

export const GroupDefinitions: DefinitionNode<string[]> = {
  layout: {
    container: ["container"],
    boxSizing: x("box-{border,content}"),

    display: x(
      "{,inline-}{block,flex,grid}",
      "inline",
      "table{,-{caption,cell,column,{column,footer,header,row}-group,row}}",
      "flow-root",
      "contents",
      "hidden"
    ),
    float: {
      all: x("float-{right,left,none}"),
      clearfix: ["clearfix"],
    },
    clear: x("clear-{left,right,both,none}"),
    objectFit: x("object-{contain,cover,fill,none,scale-down}"),
    objectPosition: x("object-{bottom,center,{left,right}{,-bottom,-top},top}"),
    overflow: {
      all: x(`overflow-{auto,hidden,visible,scroll}`),
      x: x(`overflow-x-{auto,hidden,visible,scroll}`),
      y: x(`overflow-y-{auto,hidden,visible,scroll}`),
      scrolling: x(`scrolling-{touch,auto}`),
      [Override]: {
        all: ["x", "y"],
      },
    },
    overScroll: {
      all: x(`overscroll-{auto,contain,none}`),
      x: x(`overscroll-x-{auto,contain,none}`),
      y: x(`overscroll-y-{auto,contain,none}`),
      [Override]: {
        all: ["x", "y"],
      },
    },
    position: ["static", "fixed", "absolute", "relative", "sticky"],
    tlbr: {
      inset: x(`inset-{0,auto}`),
      insetX: x(`inset-x-{0,auto}`),
      insetY: x(`inset-y-{0,auto}`),
      t: x(`top-{0,auto}`),
      r: x(`right-{0,auto}`),
      b: x(`bottom-{0,auto}`),
      l: x(`left-{0,auto}`),
      [Override]: {
        inset: ["insetX", "insetY", "t", "r", "b", "l"],
        insetX: ["r", "l"],
        insetY: ["t", "b"],
      },
    },

    visibility: ["visible", "invisible"],
    zIndex: x("z-{0,10,20,30,40,50,auto}"),
  },
  flex: {
    direction: x("flex-{row,col}{,-reverse}"),
    wrap: x("flex-wrap{,-reverse}", "flex-no-wrap"),
    alignItems: x("items-{start,end,center,baseline,stretch}"),
    alignContent: x("content-{center,start,end,between,around}"),
    alignSelf: x("self-{auto,start,end,center,stretch}"),
    justifyContent: x("justify-{start,end,center,between,around,evenly}"),
    flex: x("flex-{1,auto,initial,none}"),
    flexGrow: x("flex-grow{-0,}"),
    flexShrink: x("flex-shrink{-0,}"),
    order: x("order-{{1..12},first,last,none}"),
  },
  grid: {
    templateColumns: x("grid-cols-{{1..12},none}"),
    col: x("col-{auto,span-{1..12},{start,end}-{{1..13},auto}}"),
    templateRows: x("grid-rows-{{1..6},none}"),
    rows: x("row-{auto,span-{1..6},{start,end}-{{1..7},auto}}"),
    gap: {
      all: x(`gap-{px,${Standard.Size.Numbers}}`),
      x: x(`gap-x-{px,${Standard.Size.Numbers}}`),
      y: x(`gap-y-{px,${Standard.Size.Numbers}}`),
      [Override]: {
        all: ["x", "y"],
      },
    },
    flow: x("grid-flow-{row,col}{,-dense}"),
  },
  spacing: {
    padding: {
      all: x(`p-{px,${Standard.Size.Numbers}}`),
      x: x(`px-{px,${Standard.Size.Numbers}}`),
      y: x(`py-{px,${Standard.Size.Numbers}}`),
      t: x(`pt-{px,${Standard.Size.Numbers}}`),
      r: x(`pr-{px,${Standard.Size.Numbers}}`),
      b: x(`pb-{px,${Standard.Size.Numbers}}`),
      l: x(`pl-{px,${Standard.Size.Numbers}}`),
      [Override]: {
        all: ["x", "y", "t", "r", "b", "l"],
        x: ["r", "l"],
        y: ["t", "b"],
      },
    },
    margin: {
      all: x(`{,-}m-{px,${Standard.Size.Numbers}}`, "m-auto"),
      x: x(`{,-}mx-{px,${Standard.Size.Numbers}}`, "mx-auto"),
      y: x(`{,-}my-{px,${Standard.Size.Numbers}}`, "my-auto"),
      t: x(`{,-}mt-{px,${Standard.Size.Numbers}}`, "mt-auto"),
      r: x(`{,-}mr-{px,${Standard.Size.Numbers}}`, "mr-auto"),
      b: x(`{,-}mb-{px,${Standard.Size.Numbers}}`, "mb-auto"),
      l: x(`{,-}ml-{px,${Standard.Size.Numbers}}`, "ml-auto"),
      [Override]: {
        all: ["x", "y", "t", "r", "b", "l"],
        x: ["r", "l"],
        y: ["t", "b"],
      },
    },
    between: {
      x: x(`{,-}space-x-{px,${Standard.Size.Numbers}}`),
      y: x(`{,-}space-y-{px,${Standard.Size.Numbers}}`),
      reverseX: ["space-x-reverse"],
      reverseY: ["space-y-reverse"],
    },
  },
  sizing: {
    width: x(
      `w-{${Standard.Size.Numbers},auto,px,${Standard.Ratios},full,screen}`
    ),
    minWidth: x("min-w-{0,full}"),
    maxWidth: x(
      `max-w-{none,${Standard.Size.Numbers},full,screen-${Standard.Screens},7xl}`
    ),
    height: x(`h-{${Standard.Size.Numbers},auto,px,full,screen}`),
    minHeight: x("min-h-{0,full,screen}"),
    maxHeight: x("max-h-{full,screen}"),
  },
  typography: {
    fontFamily: x(`font-{sans,serif,mono}`),
    fontSize: x(`text-{xs,sm,base,lg,{,{2..6}}xl}`),
    fontSmoothing: x(`{,subpixel-}antialiased`),
    fontStyle: x(`{,not-}italic`),
    fontWeight: x(
      `font-{hairline,thin,light,normal,medium,semibold,bold,extrabold,black}`
    ),
    letterSpacing: x(`tracking-{tighter,tight,normal,wide,wider,widest}`),
    lineHeight: x(`leading-{{3..10},none,tight,snug,normal,relaxed,loose}`),
    listStyleType: x(`list-{none,disc,decimal}`),
    listStylePosition: x(`list-{inside,outside}`),
    placeHolderColor: x(`placeholder-${Standard.Colors}`),
    placeHolderOpacity: x(`placeholder-opacity-${Standard.Opacities}`),
    textAlign: x(`text-{left,center,right,justify}`),
    textColor: x(`text-${Standard.Colors}`),
    textOpacity: x(`text-opactiy-${Standard.Opacities}`),
    textDecoration: x(`{,no-}underline`, `line-through`),
    textTransform: ["uppercase", "lowercase", "capitalize", "normal-case"],
    verticalAlign: x(`align-{baseline,top,middle,bottom,text-{top,bottom}}`),
    whitespace: x(`whitespace-{normal,no-wrap,pre{,-line,-wrap}}`),
    wordBreak: x(`break-{normal,words,all}`, `truncate`), // multiple properties
  },
  background: {
    attachment: x(`bg-{fixed,local,scroll}`),
    clip: x(`bg-clip-{border,padding,content,text}`),
    color: x(`bg-${Standard.Colors}`),
    opacity: x(`bg-opacity-${Standard.Opacities}`),
    position: x(`bg-{top,center,bottom,{left,right}{-top,,-bottom}}`),
    repeat: x(`bg-{no-repeat,repeat{,-{x,y,round,space}}}`),
    size: x(`bg-{auto,cover,contain}`),
    image: x(`bg-{none,gradient-to-{t,tr,r,br,b,bl,l,tl}}`),
    gradient: x(`{from,via,to}-${Standard.Colors}`),
  },
  borders: {
    radius: {
      all: x(`rounded{,-{none,sm,md,lg,full}}`),
      t: x(`rounded-t{,-{none,sm,md,lg,full}}`),
      r: x(`rounded-r{,-{none,sm,md,lg,full}}`),
      b: x(`rounded-b{,-{none,sm,md,lg,full}}`),
      l: x(`rounded-l{,-{none,sm,md,lg,full}}`),
      tl: x(`rounded-tl{,-{none,sm,md,lg,full}}`),
      tr: x(`rounded-tr{,-{none,sm,md,lg,full}}`),
      br: x(`rounded-br{,-{none,sm,md,lg,full}}`),
      bl: x(`rounded-bl{,-{none,sm,md,lg,full}}`),
      [Override]: {
        all: ["t", "r", "b", "l", "tl", "tr", "br", "bl"],
        t: ["tl", "tr"],
        r: ["tr", "br"],
        b: ["bl", "br"],
        l: ["tl", "bl"],
      },
    },
    width: {
      all: x(`border{,-{0,2,4,8}}`),
      t: x(`border-t{,-{0,2,4,8}}`),
      r: x(`border-r{,-{0,2,4,8}}`),
      b: x(`border-b{,-{0,2,4,8}}`),
      l: x(`border-l{,-{0,2,4,8}}`),
      [Override]: {
        all: ["t", "r", "b", "l"],
      },
    },
    color: x(`border-${Standard.Colors}`),
    opacity: x(`border-opacity-${Standard.Opacities}`),
    style: x(`border-{solid,dashed,dotted,double,none}`),
    divideWidth: {
      x: x(`divide-x{,-{0,2,4,8,reverse}}`),
      y: x(`divide-y{,-{0,2,4,8,reverse}}`),
    },
    divideColor: x(`divide-${Standard.Colors}`),
    divideOpacity: x(`divide-opacity-${Standard.Opacities}`),
    divideStyle: x(`divide-{solid,dashed,dotted,double,none}`),
  },
  tables: {
    borderCollapse: x(`border-{collapse,separate}`),
    tableLayout: x(`table-{auto,fixed}`),
  },
  effects: {
    boxShadow: x(
      `shadow{,-{xs,sm,md,lg,xl,2xl,inner,none,solid,outline{,-${Standard.Colors}}}}`
    ),
    opacity: x(`opacity-${Standard.Opacities}`),
  },
  transitions: {
    property: x(`transition{,-{none,all,colors,opacity,shadow,transform}}`),
    duration: x(`duration-${Standard.Durations}`),
    timing: x(`ease-{linear,in,out,in-out}`),
    delay: x(`delay-${Standard.Durations}`),
    animate: x(`animate-{none,spin,ping,pulse,bounce}`),
  },
  transforms: {
    scale: {
      all: x(`scale-${Standard.Scales}`),
      x: x(`scale-x-${Standard.Scales}`),
      y: x(`scale-y-${Standard.Scales}`),
      [Override]: {
        all: ["x", "y"],
      },
    },
    rotate: x(`rotate-0`, `{,-}rotate-{45,90,180}`),
    translate: {
      x: x(`{,-}translate-x-{${Standard.Size.Numbers},px,full,1/2}`),
      y: x(`{,-}translate-y-{${Standard.Size.Numbers},px,full,1/2}`),
    },
    skew: {
      x: x(`skew-x-0`, `{,-}skew-x-{3,6,12}`),
      y: x(`skew-y-0`, `{,-}skew-y-{3,6,12}`),
    },
    origin: x(`origin-{center,left,right,{top,bottom}{,-left,-right}}`),
  },
  interactivity: {
    appearance: ["appearance-none"],
    cursor: x(`cursor-{auto,default,pointer,wait,text,move,not-allowed}`),
    outline: ["outline-none"],
    pointer: x(`pointer-events-{none,auto}`),
    resize: x(`resize-{none,x,y,both}`),
    select: x(`select-{none,text,all,auto}`),
  },
  svg: {
    fill: ["fill-current"],
    stroke: ["stroke-current"],
    strokeWidth: x(`stroke-{0,1,2}`),
  },
  accessibility: {
    screenReaders: x(`{,not-}sr-only`),
  },
};
