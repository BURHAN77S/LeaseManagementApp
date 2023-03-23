import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';

import LEASING_OBJECT from '@salesforce/schema/Leasing__c';
import Name__c from '@salesforce/schema/Leasing__c.Name__c';
import Lease_Office_Manager__c from '@salesforce/schema/Leasing__c.Lease_Office_Manager__c';
import Start_Date_Time__c from '@salesforce/schema/Leasing__c.Start_Date_Time__c';
import End_Date_Time__c  from '@salesforce/schema/Leasing__c.End_Date_Time__c';
import Max_Potential_Client__c from '@salesforce/schema/Leasing__c.Max_Potential_Client__c';
import Location__c from '@salesforce/schema/Leasing__c.Location__c';
import Leasing_Detail__c from '@salesforce/schema/Leasing__c.Leasing_Detail__c';
import Status__c from '@salesforce/schema/Leasing__c.Status__c'
import {NavigationMixin} from 'lightning/navigation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'


export default class CreateLeasing extends NavigationMixin(LightningElement) {
     @track leasingRecord={
        Name__c:'',
        Lease_Office_Manager__c:'',
        Start_Date_Time__c:null,
        End_Date_Time__c:null,
        Max_Potential_Client__c:null,
        Location__c:'',
        Leasing_Detail__c:'',
     }

     @track errors;

     handleChange(event){
        let value=event.target.value;
        let name=event.target.name;
        this.leasingRecord[name]=value;
     }

     handleLookup(event){
        let selectedRecId=event.detail.selectedRecordId;
        let parentField=event.detail.parentfield;
        this.leasingRecord[parentField]=selectedRecId;
     }

     handleClick(){
        const fields={};
        fields[Name__c.fieldApiName]=this.leasingRecord.Name__c;
        fields[Lease_Office_Manager__c.fieldApiName]=this.leasingRecord.Lease_Office_Manager__c;
        fields[Start_Date_Time__c.fieldApiName]=this.leasingRecord.Start_Date_Time__c;
        fields[End_Date_Time__c.fieldApiName]=this.leasingRecord.End_Date_Time__c;
        fields[Max_Potential_Client__c.fieldApiName]=this.leasingRecord.Max_Potential_Client__c;
        fields[Location__c.fieldApiName]=this.leasingRecord.Location__c;
        fields[Leasing_Detail__c.fieldApiName]=this.leasingRecord.Leasing_Detail__c;
        fields[Status__c.fieldApiName]='Created';

        const leasingRecord={
            apiName: LEASING_OBJECT.objectApiName,
            fields
        };

        createRecord(leasingRecord)
        .then((leasingRec)=>{
            this.dispatchEvent(new ShowToastEvent({
                    title:'Record Saved',
                    message:'Leasing Draft is Ready',
                    variant:'success'
        }));
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                actionName:"view",
                recordId:leasingRec.id
            }

        });

    })
        .catch((err)=>{
        this.errors=JSON.stringify(err);
        this.dispatchEvent(new ShowToastEvent({
            title:'Error Occured',
            message: this.errors,
            variant:'error'
        }));
    });
}

        handleCancel(){
            this[NavigationMixin.Navigate]({
                type:'standard__objectPage',
                attributes:{
                    actionName:"home",
                    objectApiName:"Leasing__c"
                }
            });
        }
}