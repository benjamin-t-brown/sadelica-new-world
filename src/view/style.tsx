import { h, JSX } from 'preact';
import picostyle, { Styles, keyframes as k } from 'picostyle';
const ps = picostyle(h as any);

export const colors = {
  BLACK: '#000000',
  WHITE: '#FFF',
  LIGHTGREY: '#BCB7C5',
  GREY: '#909090',
  DARKGREY: '#494949',
  DARKGREY_ALT: '#606060',
  BGGREY: '#727272',
  RED: '#BE2633',
  LIGHTRED: '#E1534A',
  DARKRED: '#5E3643',
  PINK: '#FFAEB6',
  LIGHTGREEN: '#B6D53C',
  GREEN: '#44891A',
  DARKGREEN: '#005F1B',
  BROWN: '#A46422',
  DARKBROWN: '#302C2E',
  ORANGE: '#FAB40B',
  PURPLE: '#9964F9',
  DARKPURPLE: '#39314B',
  LIGHTBLUE: '#42CAFD',
  BLUE: '#31A2F2',
  DARKBLUE: '#243F72',
  DARKBLUE_ALT: '#3978A8',
  CYAN: '#92F4FF',
  DARKCYAN: '#2E3740',
  YELLOW: '#F4B41B',
  DARKYELLOW: '#A05B53',
  TRANSPARENT: 'rgba(0, 0, 0, 0)',
};

export const MEDIA_QUERY_PHONE_WIDTH = '@media (max-width: 850px)';

type IntrinsicElement =
  | JSX.Element
  | JSX.Element[]
  | string
  | number
  | null
  | undefined;

export interface IntrinsicProps {
  id?: string;
  children?: never[] | IntrinsicElement[] | IntrinsicElement;
  style?: string | h.JSX.CSSProperties;
  onClick?: (ev: any) => void;
  onKeyDown?: (ev: any) => void;
  onMouseDown?: (ev: any) => void;
  onMouseOver?: (ev: any) => void;
  onMouseOut?: (ev: any) => void;
  onMouseUp?: (ev: any) => void;
  onTouchStart?: (ev: any) => void;
  onTouchEnd?: (ev: any) => void;
  ref?: Object;
  dangerouslySetInnerHTML?: any;
  // key?: string;
}

export const style = function <T>(
  cmptType: string,
  style: Styles | ((props: T) => Styles)
) {
  const cmpt = ps(cmptType)(style);
  return cmpt as unknown as (props: IntrinsicProps & T) => JSX.Element;
};

export const keyframes = (props: any) => {
  return k(props);
};
