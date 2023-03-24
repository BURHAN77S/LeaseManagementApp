public class LeasingDetailsService {

    @AuraEnabled 
    public static List<Leasing__c> upcomingLeasings(){
        
        return [SELECT Id,Name,Name__c,Leasing_Detail__c,Location__c,Location__r.Name,Lease_Office_Manager__c,Start_Date_Time__c,Lease_Office_Manager__r.Name
            FROM Leasing__c
            WHERE Start_Date_Time__c >=TODAY
            WITH SECURITY_ENFORCED];
    }


    @AuraEnabled 
    public static List<Leasing__c> searchByKeyword(string name){
        string namelike= '%' + name + '%';

        return [SELECT Id,Name,Name__c,Leasing_Detail__c,Location__c,Location__r.Name,Lease_Office_Manager__c,Start_Date_Time__c,Lease_Office_Manager__r.Name
            FROM Leasing__c
            WHERE Start_Date_Time__c>=TODAY
            AND Name__c LIKE: namelike
            WITH SECURITY_ENFORCED];
    }
}