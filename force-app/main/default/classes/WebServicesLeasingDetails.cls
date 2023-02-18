@RestResource(urlMapping='/leasing-details/*')
global with sharing class WebServicesLeasingDetails {

    @HttpGet
    global static List<LeasingDetail> getLeasingDetails() {
    List<LeasingDetail> details = new List<LeasingDetail>();
        for(Leasing__c lease : [SELECT Id, Name, Leasing_Type__c, Frequency__c, Recurring__c, Start_Date_Time__c, End_Date_Time__c FROM Leasing__c WHERE Recurring__c = true AND Start_Date_Time__c >: Date.today() WITH SECURITY_ENFORCED]){
        details.add(new LeasingDetail(lease));
        }
        return details;     
    }
    global class LeasingDetail {
        public String leasingId;
        public String name;
        public String leasingtype;
        public String frequency;
        public Boolean recuring;
        public Datetime startDate;
        public Datetime endDate;

        global LeasingDetail(Leasing__c lease){
            this.leasingId = lease.Id;
            this.name = lease.Name;
            this.leasingtype = lease.Leasing_Type__c;
            this.frequency = lease.Frequency__c;
            this.recuring = lease.Recurring__c;
            this.startDate = lease.Start_Date_Time__c;
            this.endDate = lease.End_Date_Time__c;
        }
    }
}