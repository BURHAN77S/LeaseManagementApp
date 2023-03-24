import { LightningElement ,track} from 'lwc';
import searchByKeyword from '@salesforce/apex/LeasingDetailsService.searchByKeyword';
import upcomingLeasings from '@salesforce/apex/LeasingDetailsService.upcomingLeasings';

const COLUMNS=[
    {
        label: "View",
        fieldName: "detailsPage",
        type:"url",
        wrapText:"true",
        typeAttributes:{
            label:{
                fieldName:"Name__c"
            },
            target:"_self"
        }
    },
    {
        label:"Name",
        fieldName:"Name__c",
        wrapText:"true",
        cellAttributes:{
            iconName:"standard:user",
            iconPosition:"left"
        }
    },
    {
        label:"Lease Office Manager",
        fieldName:"manager",
        wrapText:"true",
        cellAttributes:{
            iconName:"standard:user",
            iconPosition:"left"
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


export default class LeasingList extends LightningElement {

    columnsList= COLUMNS;
    error;
    startDateTime;

    @track result;
    @track recordsToDisplay;
    
    connectedCallback(){
        this.upcomingLeasingsFromApex();
    }


    upcomingLeasingsFromApex(){
        upcomingLeasings()
        .then((data)=>{
            console.log('data' + JSON.stringify(data));

            data.forEach((record)=> {
                record.detailsPage="https://" + window.location.host + "/" + record.Id;
                record.manager=record.Lease_Office_Manager__r.Name;

                if(record.Location__c){
                    record.Location=record.Location__r.Name;
                }else{
                    record.Location="This is a virtual leasing";
                }

                
            });

            this.result=data;
            this.recordsToDisplay=data;
            this.error=undefined;
        })
        .catch((err)=>{
            console.log('ERR: ' +JSON.stringify(err));
            this.error=JSON.stringify(err);
            this.result=undefined;
        });
    }

    handleSearch(event){
        let keyword=event.detail.value;

        if(keyword && keyword.length >=2){
            searchByKeyword({
                name:keyword
            })
            .then((data) => {
                console.log('data' + JSON.stringify(data));

                data.forEach((record) => {
                    record.detailsPage="https://" + window.location.host + "/" + record.Id;
                    record.manager=record.Lease_Office_Manager__r.Name;
                    if(record.Location__c){
                        record.Location=record.Location__r.Name;
                    }else{
                        record.Location="This is a virtual leasing";
                    }

                    //record.Location= record.Location__c ? record.Location__r.Name:"This is Virtual Event"
                });

                this.result=data;
                this.recordsToDisplay=data;
                this.error=undefined;
            
            })
            .catch((err)=>{
                console.log('ERR: ' +JSON.stringify(err));
                this.error=JSON.stringify(err);
                this.result=undefined;
            });
        }
    }
    handleStartDate(event){
        let valuedatetime= event.target.value;
        console.log('selectedDate' + valuedatetime);

        let filteredLeasings=this.result.filter((record,index,arrayobject)=>{
            return record.Start_Date_Time__c >=valuedatetime;
        });

        this.recordsToDisplay=filteredLeasings;
    }    

    handleLocationSearch(event){
        let keyword = event.detail.value;

        let filteredLeasings=this.result.filter((record,index,arrayobject)=>{
            return record.Location.toLowerCase().includes(keyword.toLowerCase());
        });
        if(keyword && keyword.length >=2){
            this.recordsToDisplay=filteredLeasings;
        }else{
            this.recordsToDisplay=this.result;
        }
    }
        
}