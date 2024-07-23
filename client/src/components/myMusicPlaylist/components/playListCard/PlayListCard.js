import { Table, notification } from "antd";
import "./styles.scss"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotifyAccessToken, setMusicAndAudioSource, setSpotifyLastSelectedPlaylist } from "../../../../redux/appSlice";
import spotifyApi from "../../../../api/spotify.api";
import CalendarIcon from "../../../../assets/icons/CalendarIcon";
import moment from "moment";
import { MUSIC_AND_AUDIO_SOURCE, SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT } from "../../../../utils/constants";
import _ from "lodash"
import { getSpotifyDeviceId } from "../../../../redux/spotifySlice";
import PlayIcon from "../../../../assets/images/spotify/play.png"

const PlayListCard = ({
    playListInfo
}) => {
    const dispatch = useDispatch()
    const [listSongs, setListSongs] = useState([])
    const spotifyAccessToken = useSelector(getSpotifyAccessToken)
    const spotifyDeviceId = useSelector(getSpotifyDeviceId)

    useEffect(() => {
        if(playListInfo?.id && spotifyAccessToken){
            spotifyApi.getSpotifyPlayList(playListInfo.id, spotifyAccessToken).then(rs => {
                if(rs?.tracks?.items){
                    setListSongs(rs.tracks.items)
                }
            })
        }
    }, [spotifyAccessToken, playListInfo])

    const columns = [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          align: 'left',
          render: (text, record) => <span>{_.get(record, ['track', 'name'], '')}</span>
        },
        {
          title: 'Album',
          dataIndex: 'album',
          key: 'album',
          align: 'left',
          render: (text, record) => <span>{_.get(record, ['track', 'album', 'name'], '')}</span>
        },
        {
            title: 'Added at',
            dataIndex: 'added_at',
            key: 'added_at',
            align: 'left',
            render: (text) => <span style={{ display: 'flex', alignItems: 'center'}}>
              <span style={{ marginRight: 5 }}><CalendarIcon /></span> { moment(text, SERVER_DATE_FORMAT).format(TEMPLATE_TABLE_DATE_FORMAT) }
            </span>,
          },
    ];

    const onPlayPlaylist = (uri) => {
        if(!spotifyAccessToken || !spotifyDeviceId){
            notification.warning({
                'message': "Can't play this playlist!"
            })
            return
        }
        spotifyApi.playPlayList(uri, spotifyDeviceId, spotifyAccessToken).then(data => {
            dispatch(setMusicAndAudioSource(MUSIC_AND_AUDIO_SOURCE.SPOTIFY))
            dispatch(setSpotifyLastSelectedPlaylist(uri))
        }).catch(err => {
            notification.warning({
                'message': "Can't play this playlist!"
            })
        })
    }

    return <>
        <div className="playlist-card" key={`Hit-${playListInfo.id}`}>
            <div className="playlist-card-info">
                <div className="image-container">
                    {playListInfo.images.length > 0 && <img src={playListInfo.images[0].url} alt={playListInfo.name} />}
                </div>
                <div className="playlist-info">
                    <div className="text-playlist">
                        Playlist
                    </div>
                    <div className="title mt-[8px]">
                        {playListInfo.name}
                    </div>
                    {playListInfo.description && <div className="description mt-[8px]">
                        {playListInfo.description}
                    </div>}
                    {spotifyDeviceId && <div className="mt-[12px] play-button" onClick={() => {onPlayPlaylist(playListInfo.uri)}}>
                        <img src={PlayIcon} alt="" className="w-[30px] h-[30px]"/>
                        Play
                    </div>}
                </div>
            </div>
            {/* TABLE LIST */}
            <div className="list-song-table">
                {listSongs.length > 0 && <Table
                    loading={false}
                    columns={columns}
                    dataSource={listSongs}
                    pagination={false}
                    locale={{
                        emptyText: (
                            <div className="empty-container">
                                No data can be found.
                            </div>
                        ),
                    }}
                    className="admin-shared-table"
                    rowClassName="admin-template-table"
                />}
            </div>
        </div>
    </>
}
export default PlayListCard