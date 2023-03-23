import { api, LightningElement, track } from 'lwc';

export default class Searcher extends LightningElement {
    @track keyword;

    @api isRequired = 'false';
    @api cmpLabel = 'Search Event';
    @api showLabel = 'true';

    /* Check the isRequired prop is true then set the prop to true*/

    renderedCallback(){
        if(this.isRequired === "true") {
            let picklistInfo = this.template.querySelector('lightning-input');
            picklistInfo.required = true;

            this.isRequired = "false";
        }
    }

    handleChange(event){
        var keyword = event.target.value;

        if(keyword && keyword.length >= 2){
            let seacrhEvent = new CustomEvent('seacrh', {
                detail : {value : keyword}
            });

            this.dispatchEvent(seacrhEvent);
        }
    }
}