public with sharing class LeasingDetailsController {
    
    
    @AuraEnabled
    public static List<Leasing_Real_Estate_Agent__c> getRealEstateAgents(String eventId){
        return [SELECT Id,Name,Real_Estate_Agent__c,Real_Estate_Agent__r.Name,Real_Estate_Agent__r.Phone__c,Real_Estate_Agent__r.Email__c,Real_Estate_Agent__r.Company__c,Real_Estate_Agent__r.Picture__c,Real_Estate_Agent__r.About_Me__c FROM Leasing_Real_Estate_Agent__c
        WHERE Leasing__c =: eventId
        WITH SECURITY_ENFORCED 
        ];
        
    }

    @AuraEnabled
    public static Leasing__c getLocationDetails(String eventId) {
        return [SELECT Id,Name__c,Location__c,Location__r.Name,Location__r.City__c,Location__r.Country__c,Location__r.Land_Mark__c,Location__r.Postal_Code__c,Location__r.State__c,Location__r.Street__c
        FROM Leasing__c
        WHERE Id =: eventId
        WITH SECURITY_ENFORCED
        ];
        
    }

    @AuraEnabled
    public static List<Leasing_Potential_Client__c> getPotentialClients(String eventId) {
        return [SELECT Id,Name,Potential_Client__c,Potential_Client__r.Name,Potential_Client__r.Email__c,Potential_Client__r.Company_Name__c,Potential_Client__r.Location__c,Potential_Client__r.Location__r.Name
        FROM Leasing_Potential_Client__c
        WHERE Leasing__c =: eventId
        WITH SECURITY_ENFORCED
        ];
        
    }




    
}