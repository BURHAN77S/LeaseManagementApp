public with sharing class InvSmartyStreetCaller {
    @InvocableMethod(label='Call Smarty Street' description='Makes callout to SmartyStreet API' category='Account')
    public static void makeCallout(List<ID> locationIds) {
        run(locationIds[0]);
        
    }

    @future(callout=true)
    public static void run(Id locId){
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://us-street.api.smartystreets.com/street-address?auth-id=b1bebd2c-626c-cbf9-dd11-54433ffbb44c&auth-token=nj8lgH8wUgmrj9pJke44&street=8660%20Jacquemin%20Dr&street2=&city=Cincinnati&state=OH&zipcode=45069&candidates=&match=enhanced');
            request.setMethod('GET');
            HttpResponse response = http.send(request);
            System.debug('resp: '+ response.getBody());
            Boolean isSuccess = response.getStatusCode() ==200;
                update new Location__c(Id = locId, Verified__c = isSuccess);
        }catch(Exception ex){
            ErrorLogHelper.createErrorLog('Call SmartyStreet', ex.getMessage());
        }
    }
}