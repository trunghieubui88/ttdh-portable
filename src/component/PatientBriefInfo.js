import {Box, Typography, Chip, IconButton, TextField} from '@material-ui/core';
import ChipNC from './ChipNC';
import { Favorite, FavoriteBorder, FileCopy, Share } from "@material-ui/icons";
import dataSource from "../page/PatientInfo/dataSource";
import {renderTimeSinceAnchorDate} from '../utils/index'
import { useUIHelper } from '../context/UIHelperContext';
import ClipboardJS from 'clipboard';

const districtDataSource = dataSource['local.vn_district']
function PatientBriefInfo({item, age, clipboardHandler, className, favourite}) {
  const {setSuccessMessage} = useUIHelper()
  let clipboardBnt;
  return (
    <Box className={className}>
      <Box className="patient-card-name">
        <Box className="col-left">
          <Typography variant="h5" component="h2" gutterBottom>{item.name}</Typography>
          <ChipNC nc={item.nc} />
        </Box>
        {favourite !== undefined?
        <Box>
          {favourite.following === false?
          <IconButton color="secondary" onClick={favourite.follow}>
            <FavoriteBorder />
          </IconButton>:
          <IconButton color="secondary" onClick={favourite.unfollow}>
            <Favorite />
          </IconButton>}
        </Box>
        :null}
      </Box>
      <Box>
        <Chip icon={<FileCopy />} onClick={clipboardHandler} label={item.phone} />
        <TextField id="foo" value={window.location.href} style={{zIndex:-999,position:"absolute",top:0,left:0,width:"1px"}} />
        <IconButton id="foo" className="clipboard-btn" data-clipboard-target="#foo" onClick={(e) => {
          clipboardBnt = new ClipboardJS('.clipboard-btn')
          clipboardBnt.on('success', function(e){ console.log(e) })
          clipboardBnt.on('error', function(e){ console.error(e) })
          clipboardBnt.onClick(e)
          setSuccessMessage('Link đã được copy. Chia sẻ link này nhé: '+window.location.href)
        }}>
          <Share color="primary" />
        </IconButton>
      </Box>
      {item.lastestSessionTimestamp !== undefined?
      <Box className="pt8">Lần chăm sóc cuối: <span className="text-hightlight">{renderTimeSinceAnchorDate(new Date(parseInt(item.lastestSessionTimestamp)*1000), new Date())}</span>
      </Box>:null
      }
      <Box className="pt8">
        <Box>
          <Typography>{item.gender==='Male'?"Nam":"Nữ"}, {age} tuổi</Typography>
        </Box>
        {item.phoneBelongTo !== 'Tôi' && item.phoneBelongTo !== undefined?
        <Box>
          <Typography>Số điện thoại thuộc về  {item.phoneBelongTo}</Typography>
        </Box>: null
        }
        {item.address !== undefined && item.address !== ''?
        <Typography>Số nhà/tên đường: {item.address}</Typography>:null}
        <Typography>{districtDataSource[item.districtCode] !== undefined ? districtDataSource[item.districtCode].path_with_type: null}</Typography>
        <Typography>Mã khu vực: {item.districtCode}</Typography>
      </Box>
    </Box>
  )
}

export default PatientBriefInfo;