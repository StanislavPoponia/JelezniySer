-- Тестові товари для перевірки магазину. Артикули починаються з DEMO-.
-- Видалити всі тестові товари: delete from public.products where article like 'DEMO-%';

insert into public.products (name, article, category, name_en, category_en)
select v.name, v.article, v.category, v.name_en, v.category_en
from (values
  ('Фільтр масляний',                    'DEMO-FM-101', 'Фільтри',            'Oil filter',                 'Filters'),
  ('Фільтр повітряний кросовий',         'DEMO-FP-102', 'Фільтри',            'Motocross air filter',       'Filters'),
  ('Фільтр паливний',                    'DEMO-FT-103', 'Фільтри',            'Fuel filter',                'Filters'),
  ('Колодки гальмівні передні',          'DEMO-GK-201', 'Гальмівна система',  'Front brake pads',           'Brakes'),
  ('Диск гальмівний задній',             'DEMO-GD-202', 'Гальмівна система',  'Rear brake disc',            'Brakes'),
  ('Ланцюг приводний 520, 120 ланок',    'DEMO-LP-301', 'Трансмісія',         'Drive chain 520, 120 links', 'Drivetrain'),
  ('Зірка задня 50 зубів',               'DEMO-ZZ-302', 'Трансмісія',         'Rear sprocket 50T',          'Drivetrain'),
  ('Диски зчеплення, комплект',          'DEMO-DZ-303', 'Трансмісія',         'Clutch plate set',           'Drivetrain'),
  ('Поршневий комплект 250 см³',         'DEMO-PK-401', 'Двигун',             'Piston kit 250 cc',          'Engine'),
  ('Прокладки двигуна, повний комплект', 'DEMO-PD-402', 'Двигун',             'Complete engine gasket set', 'Engine'),
  ('Свічка запалювання іридієва',        'DEMO-SZ-501', 'Електрика',          'Iridium spark plug',         'Electrics'),
  ('Акумулятор літієвий 12 В',           'DEMO-AK-502', 'Електрика',          '12 V lithium battery',       'Electrics'),
  ('Сальники вилки, комплект',           'DEMO-SV-601', 'Підвіска',           'Fork seal kit',              'Suspension'),
  ('Покришка кросова задня 110/90-19',   'DEMO-PR-701', 'Шини та колеса',     'Rear motocross tyre 110/90-19', 'Tyres and wheels')
) as v(name, article, category, name_en, category_en)
where not exists (
  select 1 from public.products p where p.article = v.article
);

-- Короткі описи для перших товарів у списку (потрібна міграція 0003).
update public.products p set description = v.description
from (values
  ('DEMO-AK-502', 'Легкий літієвий акумулятор для кросових та ендуро мотоциклів. Тестовий опис для перевірки картки товару.'),
  ('DEMO-GD-202', 'Задній гальмівний диск на заміну зношеному. Тестовий опис для перевірки картки товару.'),
  ('DEMO-DZ-303', 'Комплект дисків зчеплення для планового обслуговування чи ремонту. Тестовий опис для перевірки картки товару.'),
  ('DEMO-ZZ-302', 'Задня зірка на 50 зубів. Перед заміною перевірте стан ланцюга та передньої зірки. Тестовий опис.'),
  ('DEMO-GK-201', 'Комплект передніх гальмівних колодок. Сумісність із вашою моделлю уточнюйте в нас. Тестовий опис.')
) as v(article, description)
where p.article = v.article and p.description is null;
