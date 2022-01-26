/* @jsx h */
import { pxToPctHeight, pxToPctWidth } from 'model/screen';
import { colors, keyframes, style } from 'view/style';

interface IButtonProps {
  color?: string;
  highlighted?: boolean;
  maxWidth?: number;
  width?: number;
}

const borderPulse = keyframes({
  '0%': {
    borderWidth: '0.5rem',
  },
  '50%': {
    borderWidth: '0.4rem',
  },
  '100%': {
    borderWidth: '0.5rem',
  },
});

export const Button = style('div', (props: IButtonProps) => {
  return {
    userSelect: 'none',
    border: '0.25rem solid ' + colors.BLACK,
    borderStyle: props.highlighted ? 'double' : 'solid',
    borderWidth: props.highlighted ? '0.5rem' : '0.25rem',
    animation: props.highlighted
      ? borderPulse + ' 1s linear infinite'
      : 'unset',
    backgroundColor: colors.WHITE,
    color: colors.BLACK,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: pxToPctHeight(36),
    width: props.width ?? 'unset',
    maxWidth: props.maxWidth ?? 'unset',
    boxSizing: 'border-box',
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
    backgroundColor: props.color ?? colors.BLACK,
    color: colors.WHITE,
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
    color: props.color ?? (props.highlighted ? colors.CYAN : colors.BLACK),
    textDecoration: props.highlighted ? 'underline' : 'unset',
    fontStyle: props.highlighted ? 'italic' : '',
    maxWidth: props.maxWidth ?? 'unset',
    '&:hover': {
      filter: 'brightness(120%)',
    },
    '&:active': {
      filter: 'brightness(80%)',
    },
  };
});
