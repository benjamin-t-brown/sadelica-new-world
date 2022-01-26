/* @jsx h */
import { pxToPctHeight } from 'model/screen';
import { h } from 'preact';
import { colors, style } from 'view/style';

const Root = style('div', {
  position: 'absolute',
  left: '0',
  top: '0',
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  zIndex: '1',
});

const Title = style('div', {
  width: '100%',
  borderTop: '2px solid ' + colors.GREY,
  borderLeft: '2px solid ' + colors.GREY,
  borderRight: '2px solid ' + colors.GREY,
  textTransform: 'uppercase',
  textAlign: 'center',
  height: pxToPctHeight(23),
  color: colors.CYAN,
  background: colors.GREY,
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const ModalWindow = (props: { title: string; children: any[] | any }) => {
  return (
    <Root>
      <Title>{props.title}</Title>
      {props.children}
    </Root>
  );
};

export default ModalWindow;
