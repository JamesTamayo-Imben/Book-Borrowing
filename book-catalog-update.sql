USE borrowing_system;

START TRANSACTION;

UPDATE books
SET categoryID = CASE image
        WHEN 'book-image/book1.jpg' THEN 'KLDIS001'
        WHEN 'book-image/book2.jpg' THEN 'KLDIS001'
        WHEN 'book-image/book3.jpg' THEN 'KLDIS001'
        WHEN 'book-image/book4.jpg' THEN 'KLDIS001'
        WHEN 'book-image/book5.jpg' THEN 'KLDPS002'
        WHEN 'book-image/book6.jpg' THEN 'KLDPS002'
        WHEN 'book-image/book7.jpg' THEN 'KLDPS002'
        WHEN 'book-image/book8.jpg' THEN 'KLDPS002'
        WHEN 'book-image/book9.jpg' THEN 'KLDCE003'
        WHEN 'book-image/book10.jpg' THEN 'KLDCE003'
        WHEN 'book-image/book11.jpg' THEN 'KLDCE003'
        WHEN 'book-image/book12.jpg' THEN 'KLDCE003'
        WHEN 'book-image/book13.jpg' THEN 'KLDNS004'
        WHEN 'book-image/book14.jpg' THEN 'KLDNS004'
        WHEN 'book-image/book15.jpg' THEN 'KLDNS004'
        WHEN 'book-image/book16.jpg' THEN 'KLDNS004'
        WHEN 'book-image/book17.jpg' THEN 'KLDMW005'
        WHEN 'book-image/book18.jpg' THEN 'KLDMW005'
        WHEN 'book-image/book19.jpg' THEN 'KLDMW005'
        WHEN 'book-image/book20.jpg' THEN 'KLDMW005'
    END,
    title = CASE image
        WHEN 'book-image/book1.jpg' THEN 'The Pragmatic Programmer: Your Journey to Mastery'
        WHEN 'book-image/book2.jpg' THEN 'C# Game Programming Cookbook for Unity 3D'
        WHEN 'book-image/book3.jpg' THEN 'Clean Code'
        WHEN 'book-image/book4.jpg' THEN 'Introduction to Algorithms'
        WHEN 'book-image/book5.jpg' THEN 'Introduction to Psychology'
        WHEN 'book-image/book6.jpg' THEN 'Forty Studies That Changed Psychology'
        WHEN 'book-image/book7.jpg' THEN 'Exploring Psychology'
        WHEN 'book-image/book8.jpg' THEN 'Abnormal Psychology'
        WHEN 'book-image/book9.jpg' THEN 'Civil Engineering Formulas'
        WHEN 'book-image/book10.jpg' THEN 'The Tower and the Bridge'
        WHEN 'book-image/book11.jpg' THEN 'Why Buildings Fall Down'
        WHEN 'book-image/book12.jpg' THEN 'Beyond Failure: Forensic Case Studies for Civil Engineers'
        WHEN 'book-image/book13.jpg' THEN 'Nursing Diagnosis Handbook'
        WHEN 'book-image/book14.jpg' THEN 'Skill Checklists for Fundamentals of Nursing: The Art and Science of Nursing Care'
        WHEN 'book-image/book15.jpg' THEN 'Nursing Care Plans'
        WHEN 'book-image/book16.jpg' THEN 'Nursing: The Ultimate Study Guide'
        WHEN 'book-image/book17.jpg' THEN 'Anatomy and Physiology for Midwives'
        WHEN 'book-image/book18.jpg' THEN 'Skills for Midwifery Practice'
        WHEN 'book-image/book19.jpg' THEN 'Fetal Monitoring in Practice'
        WHEN 'book-image/book20.jpg' THEN 'Midwifery Essentials'
    END,
    author = CASE image
        WHEN 'book-image/book1.jpg' THEN 'David Thomas, Andrew Hunt'
        WHEN 'book-image/book2.jpg' THEN 'Jeff W. Murray'
        WHEN 'book-image/book3.jpg' THEN 'Robert C. Martin'
        WHEN 'book-image/book4.jpg' THEN 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein'
        WHEN 'book-image/book5.jpg' THEN NULL
        WHEN 'book-image/book6.jpg' THEN 'Roger R. Hock'
        WHEN 'book-image/book7.jpg' THEN 'David G. Myers'
        WHEN 'book-image/book8.jpg' THEN 'Ronald J. Comer'
        WHEN 'book-image/book9.jpg' THEN 'Tyler G. Hicks'
        WHEN 'book-image/book10.jpg' THEN 'David P. Billington'
        WHEN 'book-image/book11.jpg' THEN 'Matthys Levy, Mario Salvadori'
        WHEN 'book-image/book12.jpg' THEN 'Norbert J. Delatte'
        WHEN 'book-image/book13.jpg' THEN 'Betty J. Ackley, Gail B. Ladwig'
        WHEN 'book-image/book14.jpg' THEN 'Carol Taylor, Carol Lillis, Priscilla LeMone, Pamela Lynn, Marilee LeBon'
        WHEN 'book-image/book15.jpg' THEN 'Meg Gulanick, Judith L. Myers'
        WHEN 'book-image/book16.jpg' THEN 'Nadia R. Singh'
        WHEN 'book-image/book17.jpg' THEN 'Jane Coad, Melvyn Dunstall'
        WHEN 'book-image/book18.jpg' THEN 'Ruth Johnson, Wendy Taylor'
        WHEN 'book-image/book19.jpg' THEN 'Donald Gibb, Sabaratnam Arulkumaran'
        WHEN 'book-image/book20.jpg' THEN 'Joanne Gray, Rachel Smith'
    END,
    description = CASE image
        WHEN 'book-image/book1.jpg' THEN 'Practical techniques for software development and professional programming.'
        WHEN 'book-image/book2.jpg' THEN 'A cookbook of C# techniques for building games with Unity 3D.'
        WHEN 'book-image/book3.jpg' THEN 'A handbook of agile software craftsmanship and readable code.'
        WHEN 'book-image/book4.jpg' THEN 'A comprehensive reference to algorithms and their analysis.'
        WHEN 'book-image/book5.jpg' THEN 'An introductory overview of psychology from Quick & Easy Learning.'
        WHEN 'book-image/book6.jpg' THEN 'A guided look at influential experiments and research in psychology.'
        WHEN 'book-image/book7.jpg' THEN 'An introduction to core topics and research in psychology.'
        WHEN 'book-image/book8.jpg' THEN 'A study of psychological disorders, their causes, and their treatment.'
        WHEN 'book-image/book9.jpg' THEN 'A reference of formulas used across civil engineering disciplines.'
        WHEN 'book-image/book10.jpg' THEN 'A history and analysis of notable bridges and towers as works of structural art.'
        WHEN 'book-image/book11.jpg' THEN 'Case studies explain structural failures and the engineering lessons they reveal.'
        WHEN 'book-image/book12.jpg' THEN 'Forensic case studies of structural failures for civil engineering practice.'
        WHEN 'book-image/book13.jpg' THEN 'A handbook for selecting nursing diagnoses and planning patient care.'
        WHEN 'book-image/book14.jpg' THEN 'A companion of nursing skill checklists for the Fundamentals of Nursing text.'
        WHEN 'book-image/book15.jpg' THEN 'A practical collection of nursing care plans organized around patient needs.'
        WHEN 'book-image/book16.jpg' THEN 'A study guide for nursing students reviewing essential clinical knowledge.'
        WHEN 'book-image/book17.jpg' THEN 'Anatomy and physiology explained for midwifery education and practice.'
        WHEN 'book-image/book18.jpg' THEN 'A practical guide to essential clinical skills for midwifery.'
        WHEN 'book-image/book19.jpg' THEN 'A clinical guide to interpreting fetal monitoring in practice.'
        WHEN 'book-image/book20.jpg' THEN 'A concise guide to essential midwifery knowledge and practice.'
    END,
    publishedDate = NULL
WHERE image IN (
    'book-image/book1.jpg', 'book-image/book2.jpg', 'book-image/book3.jpg',
    'book-image/book4.jpg', 'book-image/book5.jpg', 'book-image/book6.jpg',
    'book-image/book7.jpg', 'book-image/book8.jpg', 'book-image/book9.jpg',
    'book-image/book10.jpg', 'book-image/book11.jpg', 'book-image/book12.jpg',
    'book-image/book13.jpg', 'book-image/book14.jpg', 'book-image/book15.jpg',
    'book-image/book16.jpg', 'book-image/book17.jpg', 'book-image/book18.jpg',
    'book-image/book19.jpg', 'book-image/book20.jpg'
);

INSERT INTO books (
    bookID, categoryID, title, author, image, description, publishedDate,
    totalStock, availableStock
)
SELECT cover.bookID, cover.categoryID, cover.title, cover.author, cover.image,
       cover.description, NULL, 3, 3
FROM (
    SELECT 'DEMO-IS-001' AS bookID, 'KLDIS001' AS categoryID,
           'The Pragmatic Programmer: Your Journey to Mastery' AS title, 'David Thomas, Andrew Hunt' AS author,
           'book-image/book1.jpg' AS image,
           'Practical techniques for software development and professional programming.' AS description
    UNION ALL SELECT 'DEMO-IS-002', 'KLDIS001', 'C# Game Programming Cookbook for Unity 3D', 'Jeff W. Murray',
           'book-image/book2.jpg', 'A cookbook of C# techniques for building games with Unity 3D.'
    UNION ALL SELECT 'DEMO-PSY-001', 'KLDIS001', 'Clean Code', 'Robert C. Martin',
           'book-image/book3.jpg', 'A handbook of agile software craftsmanship and readable code.'
    UNION ALL SELECT 'DEMO-PSY-002', 'KLDIS001', 'Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
           'book-image/book4.jpg', 'A comprehensive reference to algorithms and their analysis.'
    UNION ALL SELECT 'DEMO-CE-001', 'KLDPS002', 'Introduction to Psychology', NULL,
           'book-image/book5.jpg', 'An introductory overview of psychology from Quick & Easy Learning.'
    UNION ALL SELECT 'DEMO-CE-002', 'KLDPS002', 'Forty Studies That Changed Psychology', 'Roger R. Hock',
           'book-image/book6.jpg', 'A guided look at influential experiments and research in psychology.'
    UNION ALL SELECT 'DEMO-NS-001', 'KLDPS002', 'Exploring Psychology', 'David G. Myers',
           'book-image/book7.jpg', 'An introduction to core topics and research in psychology.'
    UNION ALL SELECT 'DEMO-NS-002', 'KLDPS002', 'Abnormal Psychology', 'Ronald J. Comer',
           'book-image/book8.jpg', 'A study of psychological disorders, their causes, and their treatment.'
    UNION ALL SELECT 'DEMO-MW-001', 'KLDCE003', 'Civil Engineering Formulas', 'Tyler G. Hicks',
           'book-image/book9.jpg', 'A reference of formulas used across civil engineering disciplines.'
    UNION ALL SELECT 'DEMO-MW-002', 'KLDCE003', 'The Tower and the Bridge', 'David P. Billington',
           'book-image/book10.jpg', 'A history and analysis of notable bridges and towers as works of structural art.'
    UNION ALL SELECT 'DEMO-CE-003', 'KLDCE003', 'Why Buildings Fall Down', 'Matthys Levy, Mario Salvadori',
           'book-image/book11.jpg', 'Case studies explain structural failures and the engineering lessons they reveal.'
    UNION ALL SELECT 'DEMO-CE-004', 'KLDCE003', 'Beyond Failure: Forensic Case Studies for Civil Engineers', 'Norbert J. Delatte',
           'book-image/book12.jpg', 'Forensic case studies of structural failures for civil engineering practice.'
    UNION ALL SELECT 'DEMO-NS-003', 'KLDNS004', 'Nursing Diagnosis Handbook', 'Betty J. Ackley, Gail B. Ladwig',
           'book-image/book13.jpg', 'A handbook for selecting nursing diagnoses and planning patient care.'
    UNION ALL SELECT 'DEMO-NS-004', 'KLDNS004', 'Skill Checklists for Fundamentals of Nursing: The Art and Science of Nursing Care', 'Carol Taylor, Carol Lillis, Priscilla LeMone, Pamela Lynn, Marilee LeBon',
           'book-image/book14.jpg', 'A companion of nursing skill checklists for the Fundamentals of Nursing text.'
    UNION ALL SELECT 'DEMO-NS-005', 'KLDNS004', 'Nursing Care Plans', 'Meg Gulanick, Judith L. Myers',
           'book-image/book15.jpg', 'A practical collection of nursing care plans organized around patient needs.'
    UNION ALL SELECT 'DEMO-NS-006', 'KLDNS004', 'Nursing: The Ultimate Study Guide', 'Nadia R. Singh',
           'book-image/book16.jpg', 'A study guide for nursing students reviewing essential clinical knowledge.'
    UNION ALL SELECT 'DEMO-MW-003', 'KLDMW005', 'Anatomy and Physiology for Midwives', 'Jane Coad, Melvyn Dunstall',
           'book-image/book17.jpg', 'Anatomy and physiology explained for midwifery education and practice.'
    UNION ALL SELECT 'DEMO-MW-004', 'KLDMW005', 'Skills for Midwifery Practice', 'Ruth Johnson, Wendy Taylor',
           'book-image/book18.jpg', 'A practical guide to essential clinical skills for midwifery.'
    UNION ALL SELECT 'DEMO-MW-005', 'KLDMW005', 'Fetal Monitoring in Practice', 'Donald Gibb, Sabaratnam Arulkumaran',
           'book-image/book19.jpg', 'A clinical guide to interpreting fetal monitoring in practice.'
    UNION ALL SELECT 'DEMO-MW-006', 'KLDMW005', 'Midwifery Essentials', 'Joanne Gray, Rachel Smith',
           'book-image/book20.jpg', 'A concise guide to essential midwifery knowledge and practice.'
) AS cover
WHERE NOT EXISTS (
    SELECT 1 FROM books existing
    WHERE existing.image = cover.image OR existing.bookID = cover.bookID
);

INSERT INTO bookstatus (bookID, status)
SELECT bookID, IF(availableStock > 0, 'available', 'unavailable')
FROM books
WHERE image IN (
    'book-image/book1.jpg', 'book-image/book2.jpg', 'book-image/book3.jpg',
    'book-image/book4.jpg', 'book-image/book5.jpg', 'book-image/book6.jpg',
    'book-image/book7.jpg', 'book-image/book8.jpg', 'book-image/book9.jpg',
    'book-image/book10.jpg', 'book-image/book11.jpg', 'book-image/book12.jpg',
    'book-image/book13.jpg', 'book-image/book14.jpg', 'book-image/book15.jpg',
    'book-image/book16.jpg', 'book-image/book17.jpg', 'book-image/book18.jpg',
    'book-image/book19.jpg', 'book-image/book20.jpg'
)
ON DUPLICATE KEY UPDATE status = VALUES(status);

COMMIT;
