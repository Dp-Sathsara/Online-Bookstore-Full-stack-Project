package com.bookstore.backend.repository;

import com.bookstore.backend.model.FAQ;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FAQRepository extends MongoRepository<FAQ, String> {

    List<FAQ> findByActiveTrueOrderBySortOrderAsc();

    List<FAQ> findByCategoryAndActiveTrueOrderBySortOrderAsc(String category);

    List<FAQ> findAllByOrderByCategoryAscSortOrderAsc();

    @Query("{ 'active': true, $or: [ { 'question': { $regex: ?0, $options: 'i' } }, { 'answer': { $regex: ?0, $options: 'i' } } ] }")
    List<FAQ> searchActiveFAQs(String keyword);

    @Query("{ $or: [ { 'question': { $regex: ?0, $options: 'i' } }, { 'answer': { $regex: ?0, $options: 'i' } } ] }")
    List<FAQ> searchAllFAQs(String keyword);

    @Query(value = "{}", fields = "{ 'category': 1 }")
    List<FAQ> findDistinctByCategory();
}
