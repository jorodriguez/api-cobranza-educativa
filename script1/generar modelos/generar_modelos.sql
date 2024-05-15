create function lcfirst(word text)
returns text
language plpgsql
immutable
as $$
begin
  return lower(left(word, 1)) || right(word, -1);
end;
$$;

create function camel_case(snake_case text)
returns text
language plpgsql
immutable
as $$
begin
  return
    replace(
      initcap(
        replace(snake_case, '_', ' ')
      ),
      ' ', ''
    );
end;
$$;





DO
$$
DECLARE 
	tabla_loop RECORD;				
	constructor_loop text := '';
	builders_loop text := '';
	build_loop text := '';
	script text := '';
BEGIN  
		raise notice '========================================================== '; 
		raise notice '=============== GENERADOR DE CLASES JAVASCRIPT =========== '; 
		raise notice '========================VER. 1============================ '; 
		raise notice '========================================================== '; 			
		FOR tabla_loop IN ( 
			SELECT * FROM information_schema.tables WHERE table_schema = 'public'
		) LOOP 
			raise notice '======================  % =====================  ', tabla_loop.table_name;		
			constructor_loop := (									
			SELECT 
				string_agg('this.'||a.attname||' = '||CASE 
					WHEN t.typname = 'int4' THEN 'null'
                    WHEN t.typname = 'numeric' THEN 'null'
					WHEN t.typname = 'text' THEN ''''''
					WHEN t.typname = 'varchar' THEN ''''''
					WHEN t.typname = 'timestamp' THEN 'null'
					WHEN t.typname = 'time' THEN 'null'
					WHEN t.typname = 'date' THEN 'null'
					WHEN t.typname = 'bool' THEN 'null'
				else ' null ' end ||' /*'||t.typname|| '*/ ' ,'; ')
			FROM pg_catalog.pg_attribute a
					LEFT JOIN pg_catalog.pg_type t ON t.oid = a.atttypid
					LEFT JOIN pg_catalog.pg_class c ON c.oid = a.attrelid
					LEFT JOIN pg_catalog.pg_constraint cc ON cc.conrelid = c.oid AND cc.conkey[1] = a.attnum
					LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = c.oid AND a.attnum = d.adnum
			--WHERE c.relname = 'usuario' AND a.attnum > 0 AND t.oid = a.atttypid
			WHERE c.relname = tabla_loop.table_name AND a.attnum > 0 AND t.oid = a.atttypid		
					--and a.attname not in ('genero','fecha_genero','fecha_modifico','eliminado')					
			);			
			builders_loop := (									
			SELECT 
				string_agg(
					' set'||(camel_case(a.attname))||'('||lcfirst(camel_case(a.attname))||'){'
						||'this.'||a.attname||' = '||lcfirst(camel_case(a.attname))||';'
						||' return this; '
					,'} ')
			FROM pg_catalog.pg_attribute a
					LEFT JOIN pg_catalog.pg_type t ON t.oid = a.atttypid
					LEFT JOIN pg_catalog.pg_class c ON c.oid = a.attrelid
					LEFT JOIN pg_catalog.pg_constraint cc ON cc.conrelid = c.oid AND cc.conkey[1] = a.attnum
					LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = c.oid AND a.attnum = d.adnum
			--WHERE c.relname = 'usuario' AND a.attnum > 0 AND t.oid = a.atttypid
			WHERE c.relname = tabla_loop.table_name AND a.attnum > 0 AND t.oid = a.atttypid		
					--and a.attname not in ('genero','fecha_genero','fecha_modifico','eliminado')					
			);				
			build_loop := (									
			SELECT 'build(){ return {'||
				string_agg(
					     a.attname||': this.'||a.attname
						,' ,')
				||'} }'
			FROM pg_catalog.pg_attribute a
					LEFT JOIN pg_catalog.pg_type t ON t.oid = a.atttypid
					LEFT JOIN pg_catalog.pg_class c ON c.oid = a.attrelid
					LEFT JOIN pg_catalog.pg_constraint cc ON cc.conrelid = c.oid AND cc.conkey[1] = a.attnum
					LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = c.oid AND a.attnum = d.adnum
			--WHERE c.relname = 'usuario' AND a.attnum > 0 AND t.oid = a.atttypid
			WHERE c.relname = tabla_loop.table_name AND a.attnum > 0 AND t.oid = a.atttypid		
					--and a.attname not in ('genero','fecha_genero','fecha_modifico','eliminado')					
			);		
			raise notice 'class %{ constructor(){ % } %}  % } ',camel_case(tabla_loop.table_name),constructor_loop,builders_loop,build_loop;
			--select 'class '||tabla_loop.table_name ||'{ constructor(){'||script_loop||'}';
		END LOOP;		
END;
$$ 
LANGUAGE plpgsql;
