public class SchedulableLeasing implements Schedulable{
    public void execute(SchedulableContext sc){
        Database.executeBatch(new BatchLeasing());
    }
}