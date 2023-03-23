import { api, LightningElement, track } from 'lwc';
import searchRecords from '@salesforce/apex/SearchController.searchRecords';
export default class CustomLookup extends LightningElement {
    /* public property */
    /* these public property will be used when using this component inside other compenent for the lookup functionality */
    /* objectName is the name of the Object which is parent either master-detail or lookup */
    /* fieldName is the field or parent object in which text needs to be searched */
    /* iconName - icon to display in the list and after selection of the record */
    /* label - to show the label for the lookup */
    /* parentIdField - the apiname of lookup/master-detail in the child object this field is useful to indentiti which parent */


   @api objectName="Leasing__c";
   @api fieldName='Name';
   @api iconName='standard:record';
   @api label='Leasing';
   @api parentIdField='Leasing__c';

   @track records;
   @track selectedRecord;

   handleSearch(event){
        var searchVal=event.detail.value;

        searchRecords({
            objName : this.objectName,
            fieldName :this.fieldName,
            searchKey:searchVal
        })
        .then(data=>{
            let parsedResponse=JSON.parse(data);
            let searchRecordList=parsedResponse[0];
            for(let i=0; i < searchRecordList.length; i++){
                let record=searchRecordList[i];
                record.Name=record[this.fieldName];
            }
            this.records=searchRecordList;
        })
        .catch(error=>{
            window.console.log('ERR:',JSON.stringfy(error));
        })
   }
   
   handleSelect(event){
        var selectedVal=event.detail.selRec;
        this.selectedRecord=selectedVal;

        let finalRecEvent= new CustomEvent('select',{
            detail:{
                selectedRecordId:this.selectedRecord.Id,
                parentfield:this.parentIdField
            }
        });

        this.dispatchEvent(finalRecEvent);
   }

   handleRemove(){
        this.selectedRecord=undefined;
        this.records=undefined;

        let finalRecEvent=new CustomEvent('select',{
            detail:{
                selectedRecordId:undefined,
                parentfield:this.parentIdField
            }
        });

        this.dispatchEvent(finalRecEvent);
   }

}