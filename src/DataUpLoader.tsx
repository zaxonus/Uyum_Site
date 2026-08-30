import Parse from 'parse';
import {useState,useEffect} from "react";


interface UyumRecord {
  sentence: string;
  engTrans: string;
  jpnTrans: string;
}

function DataUpLoader() {
  const [user,setUser] = useState<Parse.User|null>(null),
        [lastTimeStamp,setLastTimeStamp] = useState(-1)


  useEffect(() => {
    const currentUser = Parse.User.current();
		// console.log('ticFlag = ',ticFlag)
		// console.log('currentUser = ',currentUser)
    if (currentUser) {
      setUser(currentUser)
      // setContribute(true)
    } else {
      setUser(null)
      // setContribute(false)
    }
    getMaximumStamp()
  }, []);


  async function getMaximumStamp() {
    const Uyum_Sentences = Parse.Object.extend('Uyum_Sentences');
    const query = new Parse.Query(Uyum_Sentences);

    query.descending('order');
    query.limit(1);

    const record = await query.first();

    if (record) {
      setLastTimeStamp(record.get('order'))
      console.log('Max value:', record.get('order'));
    } else {
      console.log('No records found.');
    }
  } /* End of getMaximumStamp */


  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rcdList: UyumRecord[] = JSON.parse(text);

    const Uyum_Sentences = Parse.Object.extend('Uyum_Sentences'),
          nowStamp = new Date().getTime();

    // for (const item of rcdList) {
    // for (const [index, item] of rcdList.entries()) {
    console.log('lastTimeStamp:', lastTimeStamp);
    for (let i=0;i<rcdList.length;i++) {
      const item = rcdList[i],
            obj = new Uyum_Sentences(),
            timeStamp = ((rcdList.length-i-1)*lastTimeStamp+(i+1)*nowStamp)/
                        rcdList.length;
      obj.set('sentence', item.sentence);
      obj.set('engTrans', item.engTrans);
      obj.set('jpnTrans', item.jpnTrans);
      obj.set("order", timeStamp);
      obj.set("ownerID", user?.id);
      await obj.save();
      console.log('Saved:', item.sentence,' :: ', timeStamp);
    }

    console.log('rcdList.length:', rcdList.length);
    console.log('nowStamp:', nowStamp);
    console.log('ownerID:', user?.id);
    console.log('All contacts uploaded!');
  }

  return <input type="file" accept=".json" onChange={handleFileChange} />;
} /* End of DataUpLoader */


export default DataUpLoader;