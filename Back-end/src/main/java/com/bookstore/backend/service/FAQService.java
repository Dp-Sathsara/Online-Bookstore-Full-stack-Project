package com.bookstore.backend.service;

import com.bookstore.backend.model.FAQ;
import com.bookstore.backend.dto.FAQRequest;
import com.bookstore.backend.repository.FAQRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class FAQService {

    private final FAQRepository faqRepository;

    public List<FAQ> getAllActiveFAQs() {
        return faqRepository.findByActiveTrueOrderBySortOrderAsc();
    }

    public List<FAQ> getAllFAQs() {
        return faqRepository.findAllByOrderByCategoryAscSortOrderAsc();
    }

    public List<FAQ> getFAQsByCategory(String category) {
        return faqRepository.findByCategoryAndActiveTrueOrderBySortOrderAsc(category);
    }

    public Optional<FAQ> getFAQById(String id) {
        return faqRepository.findById(id);
    }

    public List<String> getCategories() {
        List<FAQ> faqs = faqRepository.findDistinctByCategory();
        return faqs.stream()
                .map(FAQ::getCategory)
                .filter(category -> category != null && !category.isEmpty())
                .distinct()
                .collect(java.util.stream.Collectors.toList());
    }

    public FAQ createFAQ(FAQRequest request) {
        FAQ faq = new FAQ();
        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());
        faq.setCategory(request.getCategory());
        faq.setSortOrder(request.getSortOrder());
        faq.setActive(request.isActive());

        return faqRepository.save(faq);
    }

    public FAQ updateFAQ(String id, FAQRequest request) {
        Optional<FAQ> existingFAQOpt = faqRepository.findById(id);
        if (existingFAQOpt.isEmpty()) {
            throw new RuntimeException("FAQ not found");
        }

        FAQ faq = existingFAQOpt.get();
        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());
        faq.setCategory(request.getCategory());
        faq.setSortOrder(request.getSortOrder());
        faq.setActive(request.isActive());
        faq.updateTimestamp();

        return faqRepository.save(faq);
    }

    public void deleteFAQ(String id) {
        if (!faqRepository.existsById(id)) {
            throw new RuntimeException("FAQ not found");
        }
        faqRepository.deleteById(id);
    }

    public FAQ activateFAQ(String id) {
        Optional<FAQ> faqOpt = faqRepository.findById(id);
        if (faqOpt.isEmpty()) {
            throw new RuntimeException("FAQ not found");
        }

        FAQ faq = faqOpt.get();
        faq.markAsActive();
        return faqRepository.save(faq);
    }

    public FAQ deactivateFAQ(String id) {
        Optional<FAQ> faqOpt = faqRepository.findById(id);
        if (faqOpt.isEmpty()) {
            throw new RuntimeException("FAQ not found");
        }

        FAQ faq = faqOpt.get();
        faq.markAsInactive();
        return faqRepository.save(faq);
    }

    public List<FAQ> searchFAQs(String keyword) {
        return faqRepository.searchActiveFAQs(keyword);
    }

    public List<FAQ> searchAllFAQs(String keyword) {
        return faqRepository.searchAllFAQs(keyword);
    }
}
