/* @jsx h */
import { h } from 'preact';
import { colors, style } from 'view/style';
import { Scrollbars } from 'preact-custom-scrollbars';
import { useCallback } from 'preact/hooks';

interface IVerticalMenuProps<T> {
  width: string;
  height: string;
  items: IVerticalMenuItem<T>[];
  onItemClick: (value: T) => void;
  style?: any;
}

interface IVerticalMenuItem<T> {
  Cmpt: (props: { value: T }) => h.JSX.Element;
  value: T;
}

const Root = style('div', {
  '& > div': {
    marginBottom: '1px',
    '&:hover': {
      filter: 'brightness(120%)',
    },
    '&:active': {
      filter: 'brightness(80%)',
    },
  },
});

const VerticalMenu = function <T>(props: IVerticalMenuProps<T>) {
  const handleClick = useCallback(
    (value: T) => {
      props.onItemClick(value);
    },
    [props]
  );

  return (
    <Scrollbars
      width={props.width}
      height={props.height}
      autoHide={false}
      autoHideTimeout={999999}
    >
      <Root
        style={{
          ...(props.style ?? {}),
        }}
      >
        {props.items.map((item, i) => {
          const Cmpt = item.Cmpt;
          return (
            <div
              key={String(item.value) + i}
              onClick={handleClick.bind(null, item.value)}
            >
              <Cmpt value={item.value}></Cmpt>
            </div>
          );
        })}
      </Root>
    </Scrollbars>
  );
};

export default VerticalMenu;
