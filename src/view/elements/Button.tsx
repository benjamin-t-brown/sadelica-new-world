/* @jsx h */
import { pxToPctHeight, pxToPctWidth } from 'model/screen';
import { colors, style } from 'view/style';

interface IButtonProps {
  color?: string;
  highlighted?: boolean;
  maxWidth?: number;
  width?: number;
}

export const Button = style('div', (props: IButtonProps) => {
  return {
    userSelect: 'none',
    border: '1px solid ' + colors.WHITE,
    backgroundColor: props.color ?? colors.DARKBLUE,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: pxToPctHeight(36),
    width: props.width ?? 'unset',
    maxWidth: props.maxWidth ?? 'unset',
    borderRadius: '0.5rem',
    '&:hover': {
      filter: 'brightness(120%)',
    },
    '&:active': {
      filter: 'brightness(80%)',
    },
  };
});

export const SmallSquareButton = style('div', (props: IButtonProps) => {
  return {
    userSelect: 'none',
    border: '1px solid ' + (props.highlighted ? colors.YELLOW : colors.WHITE),
    backgroundColor: props.color ?? colors.DARKBLUE,
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: pxToPctWidth(28),
    height: pxToPctHeight(28),
    '&:hover': {
      filter: 'brightness(120%)',
    },
    '&:active': {
      filter: 'brightness(80%)',
    },
  };
});

export const TextButton = style('div', (props: IButtonProps) => {
  return {
    userSelect: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: props.color ?? colors.YELLOW,
    textDecoration: props.highlighted ? 'underline' : 'unset',
    maxWidth: props.maxWidth ?? 'unset',
    '&:hover': {
      filter: 'brightness(120%)',
    },
    '&:active': {
      filter: 'brightness(80%)',
    },
  };
});
