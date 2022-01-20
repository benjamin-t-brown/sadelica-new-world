/*
global
*/

interface IOptionProps {
  value: string | number;
  label: string;
}

interface ISelectProps {
  items: IOptionProps[];
  value: string | number;
  onChange: (value: string | number) => void;
  style?: object;
  className?: string;
}

const G_view_Select = (props: ISelectProps): SuperfineElement => {
  return (
    <select
      className={props.className}
      style={props.style}
      value={props.value}
      onclick={(ev: Event) => {
        ev.stopPropagation();
      }}
      onchange={(ev: Event) => {
        props.onChange((ev?.target as any).value);
      }}
    >
      {props.items.map(({ value, label }) => {
        return <option value={value}>{label}</option>;
      })}
    </select>
  );
};
