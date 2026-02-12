interface ButtonProps {
    /** the text to display inside the button */
     label: string;
     disabled?: boolean;
     /** the number of times the button was clicked */
      count: number;
}




/** * a high-performance button used for primary actionss. 
 * it supports various themes and sizes .*/
export function TestButton(props: ButtonProps) {
  return <button>{props.label}</button>;
}