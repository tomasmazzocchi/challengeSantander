package com.mycompany.wsschallengesantander.interfaces.generic.impl;

import com.mycompany.wsschallengesantander.dao.generic.GenericDao;
import com.mycompany.wsschallengesantander.interfaces.generic.GenericService;
import java.io.Serializable;
import org.springframework.stereotype.Service;

@Service
public class GenericServiceImpl<T, ID extends Serializable> implements GenericService<T, ID>{         
   
    protected GenericDao<T, ID> genericDao;

    public void setGenericDao(GenericDao<T, ID> genericDao) {
        this.genericDao = genericDao;
    }   
    
}