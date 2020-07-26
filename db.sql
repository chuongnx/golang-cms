SELECT * FROM movies_movie WHERE serie_type =2;
SELECT COUNT(*) FROM movies_movie  WHERE serie_type IN (0,1);
SELECT COUNT(*) FROM movies_movie  WHERE serie_type IN (2);
SELECT COUNT(*) FROM servers_servermovie
where ;

SELECT count(*) FROM movies_movie  WHERE serie_type IN (0,1) and id in (select movie_id from servers_servermovie ) ;


SELECT * FROM movies_movie  WHERE serie_type IN (2);
SELECT * FROM movies_movie WHERE id=608902;
insert into article_file(`key`,`code`,filename,title,stream_size,bit_rate,view_count,article_id,`status`)
SELECT code,code,path,name,stream_size,bit_rate,0,0,'' FROM (SELECT a.*,b.code,b.name FROM servers_servermovie a,movies_movie b
	WHERE a.movie_id = b.id AND b.serie_type IN (0,1,2)
	) t;


update article b, movies_movie a
set b.type = a.serie_type 
where b.`key` =  a.`code` and a.serie_type IN (0,1);

select count(*) from article a
where a.type IN (0);

select a.* from article a;
select SUBSTRING_INDEX(a.`code`, '-', 1),a.* from article_file a;
update article_file set `key` = SUBSTRING_INDEX(`code`, '-', 1);

update article_file a, article b
set a.article_id = b.id 
where b.`key` =  a.`key`;

select a.*, b.* from article_file a, article b 
where b.`key` =  a.`key`

select * from article where `key` = 'i11313'

SELECT * FROM (SELECT a.*,b.code,b.name FROM servers_servermovie a,movies_movie b
	WHERE a.movie_id = b.id AND b.serie_type IN (0,1,2)
	) t;
    
    
SELECT * FROM movies_movie WHERE code ='i11313';

SELECT * FROM servers_servermovie
WHERE path LIKE '%i26762%';

INSERT INTO article(`key`,user_id,title, content,filmImage,create_time) 
SELECT `CODE`,1,`NAME`,summary,thumbnail,NOW() from movies_movie  WHERE serie_type IN (0,1);

SELECT `code`,`name`,summary,thumbnail from movies_movie
WHERE `code` = '70066';

SELECT * from article WHERE filmImage LIKE '%media%';

SELECT COUNT(*) from article WHERE filmImage LIKE '%media%';
SELECT replace(filmImage,'/media/upload_images/','') from article WHERE filmImage LIKE '%upload_images%';

UPDATE article SET filmImage = replace(filmImage,'upload_images/','') WHERE filmImage LIKE '%upload_images%';

UPDATE article d, hdzone_online.temp e 
SET d.filmImage = e.file_name
WHERE d.key = e.code;

SELECT `CODE`,1,`NAME`,summary,thumbnail,NOW() from movies_movie  WHERE serie_type IN (1);


SELECT * FROM temp;
create temporary table temp as
SELECT a.code, b.file_name
	FROM movies_movie a, movies_image b
	WHERE a.id = b.movie_id AND b.movie_id IS NOT NULL;

SELECT * from article WHERE `key` IN('i22282');

UPDATE article SET STATUS = 'CHUA_DUYET' WHERE filmImage IS NULL;

DELETE from article WHERE filmImage = '';

SELECT COUNT(*) FROM movies_movie WHERE serie_type IN (0,1);

SELECT COUNT(*),serie_type
FROM movies_movie 
WHERE STATUS = 'Y'
group by serie_type


DELETE from article