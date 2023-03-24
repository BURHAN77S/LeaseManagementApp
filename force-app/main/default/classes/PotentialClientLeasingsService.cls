public  class PotentialClientLeasingsService {
    @AuraEnabled(cacheable=true) 
    public static List<MemberWrapper> upcomingLeasings(string potentialClientId){
        
        List<Leasing__c> leasings= [SELECT Id,Name__c,Location__c,Location__r.Name,Lease_Office_Manager__c,Start_Date_Time__c,Lease_Office_Manager__r.Name, (SELECT Id,Name FROM Leasing_Potential_Clients__r WHERE Potential_Client__c =: potentialClientId)
            FROM Leasing__c
            WHERE Start_Date_Time__c >=TODAY
            WITH SECURITY_ENFORCED];


            List<MemberWrapper> memberInfo= new List<MemberWrapper>();
            for(Leasing__c lease: leasings){
                MemberWrapper wrapper = new MemberWrapper();
                wrapper.isMember= lease.Leasing_Potential_Clients__r.size() > 0;
                wrapper.leasing=lease;
                wrapper.leasingId=lease.Id;
                wrapper.leasingPotentialClient=wrapper.isMember ? lease.Leasing_Potential_Clients__r[0] :null;
                memberInfo.add(wrapper);
            }

            return memberInfo;
    }

    @AuraEnabled(cacheable=true) 
    public static List<Leasing_Potential_Client__c> pastLeasings(string potentialClientId){
        
        return [SELECT Id,Name,Leasing__c, Leasing__r.Location__c,Leasing__r.Location__r.Name,Leasing__r.Lease_Office_Manager__c,Leasing__r.Name__c,Leasing__r.Start_Date_Time__c,Leasing__r.Lease_Office_Manager__r.Name
            FROM Leasing_Potential_Client__c
            WHERE Potential_Client__c=: potentialClientId
            AND Leasing__r.Start_Date_Time__c < TODAY
            WITH SECURITY_ENFORCED];
    }

    public class MemberWrapper{
        @AuraEnabled 
        public Boolean isMember;

        @AuraEnabled 
        public string leasingId;

        @AuraEnabled 
        public Leasing_Potential_Client__c leasingPotentialClient;

        @AuraEnabled 
        public Leasing__c leasing;
    }
}