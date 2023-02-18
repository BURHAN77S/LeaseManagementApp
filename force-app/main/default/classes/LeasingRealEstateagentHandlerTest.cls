@isTest 
public class LeasingRealEstateagentHandlerTest {
    @TestSetup
    static void prepareData(){
        Lease_Office_Manager__c  manager = new Lease_Office_Manager__c (Name='Manager Test',Email__c ='testemail1@test.com', Phone__c ='12122356789');
        insert manager;

        Leasing__c  leasing1= new Leasing__c (Name__c='Test Leasing', Lease_Office_Manager__c= manager.Id, Start_Date_Time__c = Datetime.now(), End_Date_Time__c = Datetime.now().addDays(2));
        insert leasing1;

        Real_Estate_Agent__c realestateagent1 = new Real_Estate_Agent__c(Name ='Real Estate Agent  Test', Email__c='testemail2@test.com', Phone__c='12567890');
        insert realestateagent1;
        Leasing_Real_Estate_Agent__c leasingrealestateagent1= new Leasing_Real_Estate_Agent__c(Leasing__c = leasing1.Id, Real_Estate_Agent__c = realestateagent1.Id );
        insert leasingrealestateagent1;
    }

    @isTesT
    static void testSuccess(){
                 
        Leasing_Real_Estate_Agent__c systemRecord= [select  Real_Estate_Agent__c,Leasing__c from  Leasing_Real_Estate_Agent__c limit 1 ];

        test.startTest();
        try{

        insert new Leasing_Real_Estate_Agent__c(Leasing__c =systemRecord.Leasing__c,Real_Estate_Agent__c=systemRecord.Real_Estate_Agent__c);
        
        }catch(exception exc){

        }
        test.stopTest();

        integer systemCount=[select count() from Leasing_Real_Estate_Agent__c];
        system.assertEquals(1, systemCount);
    }

    @isTest 

    static void testNegative(){
                 
        delete[select id from Leasing_Real_Estate_Agent__c];

        Leasing__c leasing2= [select id from Leasing__c limit 1];
        Real_Estate_Agent__c realestateagent2= [select id from  Real_Estate_Agent__c limit 1];


        Test.startTest();
        insert new Leasing_Real_Estate_Agent__c(Leasing__c =leasing2.id,Real_Estate_Agent__c= realestateagent2.id);
        Test.stopTest();
        integer systemCount=[select count() from Leasing_Real_Estate_Agent__c];
        system.assertEquals(1, systemCount);
    }
}