/* @jsx h */
import { canvasCoordsToScreenCoords } from 'model/canvas';
import { getScale } from 'model/generics';
import { getTileSize } from 'model/tile';
import { h } from 'preact';
import { style } from 'view/style';

const Root = style('div', {
  position: 'absolute',
  boxSizing: 'border-box',
  // border: '1px solid white',
});

interface ITileOverlayProps {
  x: number;
  y: number;
  children?: any | any[];
  id?: string;
}
const TileOverlay = (props: ITileOverlayProps) => {
  const [x, y] = canvasCoordsToScreenCoords(props.x, props.y);

  return (
    <Root
      id={props.id}
      style={{
        left: x,
        top: y,
        width: getTileSize() * getScale(),
        height: getTileSize() * getScale(),
      }}
    >
      {props.children}
    </Root>
  );
};

export default TileOverlay;
