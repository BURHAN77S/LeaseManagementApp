import getLocationDetails from '@salesforce/apex/LeasingDetailsController.getLocationDetails';
import getPotentialClients from '@salesforce/apex/LeasingDetailsController.getPotentialClients';
import getRealEstateAgents from '@salesforce/apex/LeasingDetailsController.getRealEstateAgents';

import { getRecord } from 'lightning/uiRecordApi';
import { api, LightningElement, track, wire } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import {encodeDefaultFieldValues} from 'lightning/pageReferenceUtils';

import userId from "@salesforce/user/Id";
import profile from "@salesforce/schema/User.Profile.Name";





const COLUMNS=[
        {
            label: "Name",
            fieldName: "Name",
            cellAttributes:{
                iconName:"standard:user",
                iconPosition:"left"
            }
        },
        {
            label:"Email",
            fieldName:"Email",
            type:"email"
        },
        {
            label:"Company",
            fieldName:"Company"
        },
        {
            label: "Location",
            fieldName: "Location",
            cellAttributes:{
                iconName:"utility:location",
                iconPosition:"left"
            }
        }
];


export default class LeasingDetails extends NavigationMixin(LightningElement) {
    
    @api recordId;

    @track speakerList;
    @track eventRec;
    @track attendeesList;

    errors;
    columnsList=COLUMNS;
    user_id=userId;

    @wire(getRecord, {recordId: "$user_id",fields:[profile] })
    wireMethod({error,data}){
      if (data) {
        window.console.log("userRecord",data);
    }  

    if (error) {
        console.log("Error Occured ", JSON.stringify(error));
        
    }
    }

    handleSpeakerActive(){
        getRealEstateAgents({
            eventId:this.recordId
        })
        .then((result) => {
            result.forEach((speaker) => {
                speaker.Name=speaker.Real_Estate_Agent__r.Name;
                speaker.Email="**********@gmail.com";
                speaker.Phone=speaker.Real_Estate_Agent__r.Phone__c;
                speaker.Picture=speaker.Real_Estate_Agent__r.Picture__c;
                speaker.About_Me=speaker.Real_Estate_Agent__r.About_Me__c;
                speaker.Company=speaker.Real_Estate_Agent__r.Company__c;
            });

            this.speakerList=result;
            window.console.log("result",JSON.stringify(this.result));
            this.errors=undefined;
        })

        .catch((err) => {
            this.errors =err;
            this.speakerList=undefined;
            window.console.log("ERR:", this.errors);


        });
    }

    handleLocationDetails(){
        getLocationDetails({
            eventId:this.recordId
        })
        .then((result) => {
            if (result.Location__c) {
                this.eventRec=result;
                
            }else{
                this.eventRec=undefined;
            }
            this.errors=undefined;
        })
        .catch((err) => {
            this.errors =err;
            this.speakerList=undefined;
        });
    }

    handleEventAttendee(){
        getPotentialClients({
            eventId: this.recordId
        })
        .then((result) => {
            result.forEach((att) => {
                att.Name=att.Potential_Client__r.Name;
                att.Email="********@gmail.com";
                att.Company_Name=att.Potential_Client__r.Company_Name__c;

                if(att.Potential_Client__r.Location__c){
                    att.Location=att.Potential_Client__r.Location__r.Name;
                }else{
                    att.Location="Preferred Not to Say";
                }
            });
            this.attendeesList=result;
            this.errors=undefined;

        })
        .catch((err) => {
            this.errors=err;
            this.speakerList=undefined;
        });
    }

    createSpeaker(){
        const defaultValues = encodeDefaultFieldValues({
            Leasing__c:this.recordId
        });

        this[NavigationMixin.Navigate]({
            type:"standard__objectPage",
            attributes:{
                objectApiName:"Leasing_Real_Estate_Agent__c",
                actionName:"new"
            },
            state: {
                defaultFieldValues:defaultValues
            }
        });
    }

    createAttendee(){

        const defaultValues = encodeDefaultFieldValues({
            Leasing__c:this.recordId
        });

        this[NavigationMixin.Navigate]({
            type:"standard__objectPage",
            attributes:{
                objectApiName:"Leasing_Potential_Client__c",
                actionName:"new"
            },
            state: {
                defaultFieldValues:defaultValues
            }
        });

    }


    

    
}