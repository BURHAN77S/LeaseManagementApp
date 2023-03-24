import upcomingLeasings from '@salesforce/apex/PotentialClientLeasingsService.upcomingLeasings';
import pastLeasings from '@salesforce/apex/PotentialClientLeasingsService.pastLeasings';
import { api, LightningElement } from 'lwc';

const COLUMNS=[
    {
        label: "Leasing Name",
        fieldName: "detailsPage",
        type:"url",
        wrapText:"true",
        typeAttributes:{
            label:{
                fieldName:"Name"
            },
        }
    },
    {
        label:"Name",
        fieldName:"LEASINGMANAGER",
        cellAttributes:{
            iconName:"standard:user",
            iconPosition:"left"
        }
    },
    {
        label:"Leasing Date",
        fieldName:"StartDateTime",
        type:"date",
        typeAttributes:{
            weekday:"long",
            year:"numeric",
            month:"long"
        }
    },
    {
        label: "Location",
        fieldName: "Location",
        type:"text",
        wrapText:"true",
        cellAttributes:{
            iconName:"utility:location",
            iconPosition:"left"
        }
    }
];


export default class PotentialClientLeasings extends LightningElement {
    @api recordId;
    selectedLeasings;
    upcomingLeasings;
    pastLeasings;
    columnsList=COLUMNS;
    errors;
    retrievedRecordId=false;

    renderedCallback(){
        console.log('rendered call back');
        if(!this.retrievedRecordId && this.recordId){
            this.retrievedRecordId=true;

            console.log("found recordId" + this.recordId);

            this.upcomingLeasingsFromApex();
            this.pastLeasingsFromApex();
        }
    }

    upcomingLeasingsFromApex(){
        upcomingLeasings({
            potentialClientId:this.recordId
        })
        .then((result)=>{
            console.log('result' +JSON.stringify(result));

            this.upcomingLeasings=[];
            this.selectedLeasings=[];
            result.forEach((record)=>{
                let obj= new Object();
                obj.Id=record.leasingId;
                obj.Name=record.leasing.Name__c;
                obj.detailsPage="https://" + window.location.host + "/" + record.leasing.Id;
                obj.LEASINGMANAGER=record.leasing.Lease_Office_Manager__r.Name;
                obj.StartDateTime=record.leasing.Start_Date_Time__c;

                if(record.leasing.Location__c){
                    obj.Location=record.leasing.Location__r.Name;
                }else{
                    obj.Location="This is a virtual leasing";
                }

                this.upcomingLeasings.push(obj);

                if(record.isMember) this.selectedLeasings.push(obj.Id);

            });

            this.leasings=result;
            this.errors=undefined;
            

            })
            .catch((error)=>{
                this.upcomingLeasings=undefined;
                this.errors=JSON.stringify(error);
            });
    }

    pastLeasingsFromApex(){
        pastLeasings({
            potentialClientId: this.recordId
        })
        .then((result)=>{
            this.pastLeasings=[];
            result.forEach((record) => {
                let pastLeasing={
                Name : record.Leasing__r.Name__c,
                detailsPage:"https://" + window.location.host + "/" + record.Leasing__c,
                LEASINGMANAGER : record.Leasing__r.Lease_Office_Manager__r.Name,
                StartDateTime : record.Leasing__r.Start_Date_Time__c,
                Location : (record.Leasing__r.Location__c ? record.Leasing__r.Location__r.Name: "This is a virtual leasing")
                }

                this.pastLeasings.push(pastLeasing);

            });
            this.errors=undefined;
        })
        .catch((error)=>{
            this.pastLeasings=undefined;
            this.errors=JSON>stringify(error);
        });
    }
}