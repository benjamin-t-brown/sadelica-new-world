/* @jsx h */
import { h } from 'preact';
import { getSprite, Sprite } from 'model/canvas';
import { useEffect, useState } from 'preact/hooks';
import { randomId } from 'utils';
import { drawSprite } from 'view/draw';
import { style } from 'view/style';

const Root = style('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

interface ISpriteDivProps {
  sprite: Sprite | string;
  scale: number;
}

const SpriteDiv = (props: ISpriteDivProps) => {
  const [id] = useState(randomId());
  const localSprite =
    typeof props.sprite === 'string'
      ? getSprite(props.sprite ?? 'invisible')
      : props.sprite;

  console.log('render sprite div', props.sprite, localSprite);

  const width = localSprite[3];
  const height = localSprite[4];

  useEffect(() => {
    const canv = document.getElementById(id) as HTMLCanvasElement | null;
    if (canv) {
      const ctx = canv.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        drawSprite(localSprite, 0, 0, props.scale, ctx);
      }
    }
  }, [id, localSprite, props.scale]);

  return (
    <Root
      style={
        {
          // width: width * props.scale,
          // height: height * props.scale,
        }
      }
    >
      <canvas
        width={width * props.scale}
        height={height * props.scale}
        id={id}
      ></canvas>
    </Root>
  );
};

export default SpriteDiv;
