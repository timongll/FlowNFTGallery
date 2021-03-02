import {useState, useEffect} from "react"
import {useCurrentUser} from "./hooks/current-user"
import {useProfile} from "./hooks/profile"

function ProfileForm() {
  const cu = useCurrentUser()
  const profile = useProfile(cu.addr)
  const [name, setName] = useState("")
  useEffect(() => {
    setName(profile.name)
  }, [profile.name])

  const submit = () => {
    profile.setName(name)
  }

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      {profile.isIdle && <button onClick={submit}>Update Name</button>}
      {profile.isProcessing && <span>PROCESSING</span>}
    </div>
  )
}

export function ProfileCluster({address}) {
  const profile = useProfile(address)
  useEffect(() => profile.refetch(), [address])
  if (address == null) return null

  return (
    <div>
      <h3>Profile: {address}</h3>
      {profile.isCurrentUser && <ProfileForm />}
      <ul>
        <li>
          <img
            src={profile.avatar}
            width="50px"
            height="50px"
            alt={profile.name}
          />
        </li>
        <li>
          <strong>Name: </strong>
          <span>{profile.name}</span>
          {profile.isCurrentUser && <span> -You</span>}
          {profile.isProcessing && <span>PROCESSING</span>}
        </li>
        <li>
          <strong>Color: </strong>
          <span>{profile.color}</span>
        </li>
        <li>
          <strong>Info: </strong>
          <span>{profile.info}</span>
        </li>
      </ul>
    </div>
  )
}