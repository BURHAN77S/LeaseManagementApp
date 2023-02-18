public class LeasingRealEstateAgentHandler {
    public static void validateLeasingRealEstateAgent(List<Leasing_Real_Estate_Agent__c> LeasingRealEstateAgents) {
          set<id> leasingIds = new set<Id>();
          set<id> realestateagentIds = new set<id>();
          map<String,Leasing_Real_Estate_Agent__c> LeasingRealEstateAgentMap = new map<string,Leasing_Real_Estate_Agent__c>();
          for(Leasing_Real_Estate_Agent__c lr : LeasingRealEstateAgents ){
            leasingIds.add(lr.Leasing__c);
            realestateagentIds.add(lr.Real_Estate_Agent__c);

            string ourKey = string.valueOf(lr.Leasing__c) + string.valueOf(lr.Real_Estate_Agent__c);
            LeasingRealEstateAgentMap.put(ourKey, lr);
          }

          system.debug('leasingIds' + leasingIds);
          system.debug('realestateagentIds' + realestateagentIds);

          for(Leasing_Real_Estate_Agent__c lr: [select id, Leasing__c,Real_Estate_Agent__c FROM Leasing_Real_Estate_Agent__c WHERE Leasing__c IN:leasingIds AND  Real_Estate_Agent__c IN: realestateagentIds]) {

            string systemKey = string.valueOf(lr.Leasing__c) + string.valueOf(lr.Real_Estate_Agent__c);
            Leasing_Real_Estate_Agent__c toBeFailed = LeasingRealEstateAgentMap.get(systemKey);
            if(toBeFailed != null){
                toBeFailed.addError('This is a duplicate record');
            }

          }
    }
}