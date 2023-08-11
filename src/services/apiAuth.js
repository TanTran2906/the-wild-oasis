import supabase, { supabaseUrl } from './supabase'

export async function signup({ fullName, email, password }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                fullName,
                avatar: ""
            }
        }
    })

    if (error) throw new Error(error.message)

    return data
}

export async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) throw new Error(error.message)

    return data

}

export async function getCurrentUser() {
    const { data: session } = await supabase.auth.getSession() //Lấy dữ liệu phiên hiện tại
    if (!session.session) return null

    const { data, error } = await supabase.auth.getUser() // Nếu người dùng có phiên hợp lệ thì lấy dữ liệu người dùng

    if (error) throw new Error(error.message)

    return data?.user
}

export async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
}

export async function updateCurrentUser({ password, fullName, avatar }) {
    //1.Update password OR fullName
    let updateData;
    if (password) updateData = { password }
    if (fullName) updateData = { data: { fullName } } //lấy theo kiểu này vì là options trong hàm signup

    const { data, error } = await supabase.auth.updateUser(updateData)

    if (error) throw new Error(error.message)
    if (!avatar) return data

    //2.Upload the avatar image
    const fileName = `avatar-${data.user.id}-${Math.random()}` //Định cấu trúc tên file này duy nhất
    const { error: storageError } = await supabase.storage.from("avatars").upload(fileName, avatar)

    if (storageError) throw new Error(storageError.message)

    //3.Update avatar in the user
    //avatar: Ảnh tồn tại dạng Url ở supabase: https://ijzvdlcgvxyfrbcjjbvt.supabase.co/storage/v1/object/public/avatars/avatar-001.jpg?t=2023-08-11T16%3A11%3A25.779Z --> Tuân theo định dạng này
    const { data: updateUser, error: error2 } = await supabase.auth.updateUser({
        data: {
            avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`
        }
    })

    if (error2) throw new Error(error2.message)
    return updateUser
}
