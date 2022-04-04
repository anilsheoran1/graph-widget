import React,{ useState, useRef, useEffect } from  'react';

export default function Input({className, type, value, prefix, suffix, setInput, style, offset}){
  const [width, setWidth] = useState(0);
  const span = useRef();

  useEffect(() => {
    setWidth(span.current.offsetWidth + offset);
  }, [value]);

  const changeHandler = evt => {
    let input = evt.target.value.replace(/,/g, "")
    if(input){
        input = Number(input)
    }
    setInput(input);
  };

  return (
    <span className="input-wrapper" style={{...style}}>
       {prefix && <span className={className}>{prefix}</span>}  
      <span className={className} id="hide" ref={span}>{value}</span>
      <input className={className} value={value} type={type} style={{ width }} onChange={changeHandler} />
      {suffix && <span className={className}>{suffix}</span>}
    </span>
  );
};