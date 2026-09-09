# Setup Cloud PostgreSQL + PostGIS + Koneksi Dbeaver

## Setup Cloud PostgreSQL + PostGIS + Koneksi Dbeaver

1. Buka Supabase [https://supabase.com/](https://supabase.com/)
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image.png)
    
2. SignUp untuk register akun baru jika belum punya
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%201.png)
    
3. Setelah verifikasi email akan diminta untuk membuat organization, pilih type personal dan plan free
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%202.png)
    
4. Setelah membuat organization akan muncul tampilan pembuatan project, biarkan semua pilihan default, buat database password dan simpan password tersebut
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%203.png)
    
5. Berikut adalah tampilan awal jika project sudah dibuat
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%204.png)
    
6. Klik Connect pada menu di sebelah atas, maka detail connection untuk melakukan koneksi ke database ini akan muncul, pilih bagian ORM Third-party library
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%205.png)
    
7. Di bagian env local ada variabel bernama DATABASE_URL, variabel tersebut berisi informasi untuk melakukan koneksi ke database. Berikut adalah variabel DATABASE_URL milik saya, simpan nama user (font biru) dan host (font hijau)
    
    ```jsx
    DATABASE_URL="postgresql://postgres.aefvxqjmwtbeysjyfzgo:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    ```
    
8. Buka Dbeaver kemudian buat New Database Connection ke database yang sudah dibuat dengan connection detail yang ada di project supabase
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%206.png)
    
9. Isikan detail koneksi dengan host dan nama user yang sudah kita simpan dari supabase, masukan juga Password yang sudah kita buat di awal pembuatan project. Lalu klik test connection
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%207.png)
    
10. Database sudah terhubung menggunakan Dbeaver
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%208.png)
    
    ![](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image8.png)
    
11. Kembali ke web supabase di halaman overview project, klik Database yang ada di Menu sebelah kiri
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%209.png)
    
12. Setelah itu klik Extensions
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%2010.png)
    
13. Cari extension postgis dengan mengetik postgis di kolom pencarian kemudian enable extension bernama postgis saja
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%2011.png)
    
14. Setelah klik enable akan ada pilihan untuk memilik schema, ganti pilihan tersebut dengan Create New Schema, kemudian buat Nama Schema nya menjadi gis
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%2012.png)
    
15. Jika berhasil klik Schema Visualizer kemudian ganti schema menjadi gis maka tampilan akan seperti ini
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%2013.png)
    

## **Koneksi PostgreSQL Supabase dari QGIS**

1. Buka QGIS kemudian buat koneksi database baru
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%2014.png)
    
2. Kemudian masukkan credential dari Supabase anda
    
    ![](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image3.png)
    
3. Credential Supabase yang anda gunakan bukanlah super user seperti saat anda menggunakan PostgreSQL lokal, oleh karena itu perlu pengaturan tambahan dari Supabase. Buka Supabase kemudian pergi ke SQL Editor
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%2015.png)
    
4. Jalankan perintah berikut di SQL Editor
    
    ```jsx
    -- 1. Buat wrapper di schema PUBLIC
    CREATE OR REPLACE FUNCTION public.addgeometrycolumn(
    		catalog_name character varying,
    		schema_name character varying,
    		table_name character varying,
    		column_name character varying,
    		new_srid integer,
    		new_type character varying,
    		new_dim integer
    ) RETURNS text AS $$
    BEGIN
    		RETURN extensions.AddGeometryColumn(schema_name, table_name, column_name, new_srid, new_type, new_dim);
    EXCEPTION WHEN OTHERS THEN
    		RETURN public.AddGeometryColumn(schema_name, table_name, column_name, new_srid, new_type, new_dim);
    END;
    $$ LANGUAGE plpgsql;
    -- 2. Buat wrapper di schema GIS
    CREATE OR REPLACE FUNCTION gis.addgeometrycolumn(
        catalog_name character varying,
        schema_name character varying,
        table_name character varying,
        column_name character varying,
        new_srid integer,
        new_type character varying,
        new_dim integer
    ) RETURNS text AS $$
    BEGIN
        RETURN extensions.AddGeometryColumn(schema_name, table_name, column_name, new_srid, new_type, new_dim);
    EXCEPTION WHEN OTHERS THEN
        RETURN public.AddGeometryColumn(schema_name, table_name, column_name, new_srid, new_type, new_dim);
    END;
    $$ LANGUAGE plpgsql;
    
    GRANT EXECUTE ON FUNCTION public.addgeometrycolumn TO PUBLIC, postgres, anon, authenticated, service_role;
    ```
    
    ![](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image20.png)
    
5. Buat layer baru sama seperti di local database
    
    ![image.png](Setup%20Cloud%20PostgreSQL%20+%20PostGIS%20+%20Koneksi%20Dbeaver/image%2016.png)