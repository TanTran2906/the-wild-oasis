import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {

    const { data, error } = await supabase
        .from('cabins')
        .select('*')
    // .order("created_at", { ascending: true }); //Cái mới nhất sẽ ở trên đầu

    if (error) {
        console.error(error)
        throw new Error('Cabins could not be loaded')
    }

    return data
}

export async function deleteCabin(id) {
    const { data, error } = await supabase
        .from('cabins')
        .delete()
        .eq('id', id)

    if (error) {
        console.error(error)
        throw new Error('Cabins could not be deleted')
    }

    return data
}

export async function createEditCabin(newCabin, id) {
    // console.log(newCabin, id)
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);


    //1)Create/edit Cabin
    //Xử lý đầu vào tên của ảnh khi người dùng upload --> Đảm bảo ảnh là duy nhất trong storage
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
        "/",
        ""
    );

    //Ảnh tồn tại dạng Url ở supabase: https://ijzvdlcgvxyfrbcjjbvt.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg --> Tuân theo định dạng này
    //Xử lý 2 TH:
    //TH1: image url không ở dạng FileList vì lấy url mặc định có trong CSDL(tức lấy image cũ submit luôn mà không upload ảnh mới)
    //TH2: upload image mới
    const imagePath = hasImagePath
        ? newCabin.image
        : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    let query = supabase.from('cabins')

    //A)Create cabin
    if (!id) query = query.insert([
        { ...newCabin, image: imagePath }])

    //B)Edit cabin
    if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id)

    const { data, error } = await query.select().single()
    //select().single() được sử dụng sau khi thêm dữ liệu vào bảng cabins để lấy lại dữ liệu của bản ghi mới nhất vừa được thêm thành công vào bảng vì Supabase không trả về dữ liệu của bản ghi sau khi thêm vào bảng(chậm 1 nhịp).

    if (error) {
        console.error(error)
        throw new Error('Cabins could not be inserted')
    }

    //2)Upload image
    if (hasImagePath) return data;
    const { error: storageError } = await supabase.storage.from('cabin-images').upload(imageName, newCabin.image)

    //3)Delete the cabin IF there was an error uploading image
    if (storageError) {
        await supabase
            .from('cabins')
            .delete()
            .eq('id', data.id)
        console.error(storageError)
        throw new Error("Cabin image could not be uploaded and the cabin was not created")
    }

    return data
}
