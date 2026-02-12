import React from 'react';

/**
 * A highly customizable slider component for selecting ranges.
 * This was detected automatically by the Jumbo Parser!
 */
interface CoolSliderProps {
  /** The current value of the slider */
  value: number;
  /** The minimum allowed value */
  min: number;
  /** The maximum allowed value */
  max: number;
  
  /** The label displayed above the slider */
  label: string;
  
  /** If true, the slider cannot be moved */
  disabled?: boolean;
}

export function CoolSlider(props: CoolSliderProps) {
  return (
    <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
      <label style={{ display: 'block', fontWeight: 'bold' }}>{props.label}</label>
      <input 
        type="range" 
        min={props.min} 
        max={props.max} 
        value={props.value} 
        disabled={props.disabled}
        style={{ width: '100%' }}
        readOnly
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{props.min}</span>
        <span>{props.max}</span>
      </div>
    </div>
  );
}