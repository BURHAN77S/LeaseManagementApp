public class LeaseOfficeManagerHandler {
    public static void leaseOfficeInsert(){
        try {
            Lease_Office_Manager__c lom = new Lease_Office_Manager__c();
            lom.Name='Billy Hope';
            lom.Phone__c='9876543210';
            insert lom;
        } catch (DmlException dex) {
            ErrorLogHelper.createErrorLog('Creating lease office manager error',  dex.getDmlMessage(0));
        }
    }
}