update  co_alumno
			SET total_adeudo = (
					select sum(c.total) from co_cargo_balance_alumno c where c.co_alumno = id
			)			
			where id in (			
				select cargo.co_alumno 
					from co_cargo_balance_alumno cargo 
					inner join co_curso curso on curso.id = cargo.co_curso		
					inner join co_alumno al on al.id = cargo.co_alumno
					where  curso.co_sucursal = 4
			) 
