package com.mycompany.wsschallengesantander.dao.generic;

import com.mycompany.wsschallengesantander.interfaces.generic.Fieldeable;
import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;

 public interface GenericDao<T,ID extends Serializable> {   
    
    public static final List<Order> EMPTY_ORDERS = Collections.<Order>emptyList();
    public static final List<Criterion> EMPTY_RESTRICTIONS = Collections.<Criterion>emptyList();
    public static final List<Fieldeable> EMPTY_ALIASES = Collections.<Fieldeable>emptyList();   
    
}
