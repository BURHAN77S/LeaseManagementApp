public class BatchLeasing implements database.Batchable<SObject>{
    
    public database.QueryLocator start(database.BatchableContext bc) {
        
        database.QueryLocator q1 = Database.getQueryLocator([select id, name from Leasing__c WHERE End_Date_Time__c <=: Datetime.now().addMonths(-2) AND Status__c='Completed']);
        return q1;
    }

    public void execute(database.BatchableContext bc, list<Leasing__c> scope) {
        delete scope;
    }

    public void finish(database.BatchableContext bc) {
        AsyncApexJob a =[select id,Status,NumberOfErrors, JobItemsProcessed,TotalJobItems,CreatedBy.Email from AsyncApexJob where id=: bc.getJobId()];

        set<Id> userIds=new set<Id>();
    for(groupMember gm:[select UserOrGroupId from groupMember where Group.name= 'DailyJob']){
        userIds.add(gm.UserOrGroupId);

    }
    set<String> emailAddresses=new set<String>();
    for(user us:[select email from user where IsActive =true and Id in: userIds]){
        emailAddresses.add(us.email);

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setSubject('Daily Job Leasing Completed.');
        mail.setSenderDisplayName('SI Salesforce Robot');
        mail.setPlainTextBody('Daily Job Leasing is Completed.You can check Setup ->Apex Jobs.');
        mail.setHtmlBody('<p>Daily Job Leasing is Completed.You can check Setup ->Apex Jobs.</p>');


        String[] toAddresses = new String[] {'burhanceliks77@gmail.com'};
        mail.setToAddresses(new List<String>(emailAddresses));
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{mail});
        }
    }
}