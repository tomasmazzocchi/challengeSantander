package com.mycompany.wsschallengesantander.repositories;

import com.mycompany.wsschallengesantander.model.Meeting;
import java.util.ArrayList;
import java.util.List;

public class RepositoryMeetings {
    private static RepositoryMeetings repositoryMeetingsInstance;
    private List<Meeting> meetings = new ArrayList<>();

    public RepositoryMeetings() {
    }
    
    public static RepositoryMeetings getInstance() {
        if(repositoryMeetingsInstance == null) {
            repositoryMeetingsInstance = new RepositoryMeetings();
        }
        return repositoryMeetingsInstance;
    }

    public List<Meeting> getMeetings() {
        return meetings;
    }

    public void setMeetings(List<Meeting> meetings) {
        this.meetings = meetings;
    }

    
}
