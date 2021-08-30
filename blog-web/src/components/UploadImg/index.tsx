import { Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import ImgUrl from '../../store'

// 图片转base64,用于显示预览
function getBase64(img: any, callback: any) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
// 选择图片验证
function beforeUpload(file: any) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传jpg或png图片！')
  }
  const isLt2M = file.size / 1024 / 1024 < 0.7
  if (!isLt2M) {
    message.error('图片必须小于 700kB!')
  }
  return isJpgOrPng && isLt2M
}

export default function UploadImg() {
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(info: any) {
    getBase64(info.file, (imageUrl: any) => {
      ImgUrl.setImgUrl(imageUrl)
      setImageUrl(imageUrl)
      setLoading(true)
      handleUpload(info.file)
    })
  }

  function handleUpload(file: any) {
    if (!beforeUpload(file)) {
      return
    }
    const formData = new FormData()
    formData.append('file', file.File)
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )
  return (
    <Upload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={() => false}
      onChange={handleChange}>
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
      ) : (
        uploadButton
      )}
    </Upload>
  )
}
