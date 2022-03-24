export const RateTypeChange= "rateTypeChanged";

export function publish(eventName, data){
    document.dispatchEvent( new CustomEvent(eventName, {
        //  bubbles: true,
          detail: data
        })
    )
}

export function subscribe(eventName, handler){
    function handleEvent(e){
        handler(e.detail);
    }
   document.addEventListener(eventName, handleEvent);
   return ()=>{document.removeEventListener(eventName, handleEvent)}
}
