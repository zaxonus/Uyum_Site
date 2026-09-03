import {useState,useEffect} from 'react';

function DataBackUp() {
  const [user,setUser] = useState<Parse.User|null>(null)

  useEffect(() => {
    const currentUser = Parse.User.current();
		// console.log('ticFlag = ',ticFlag)
		console.log('currentUser = ',currentUser)
    if (currentUser) setUser(currentUser)
    else setUser(null)
  }, []);


  return (
    <div className='flex flex-col items-center justify-around h-screen'>
      <button className='bg-slate-800 text-sky-100 text-center \
                         font-serif text-4xl p-2 \
                         border-4 border-yellow-400 rounded-lg'
              type="button"
              // onClick={backUpTask}>
              onClick={()=>backUpTask(user?.id!)}>
        Export Backup
      </button>
    </div>
  )
} /* End of DataBackUp */


async function backUpTask(userID:string) {
  const Uyum_Sentences = Parse.Object.extend('Uyum_Sentences');
  const query = new Parse.Query(Uyum_Sentences);
  query.ascending("order");
  query.limit(256);
  const records = await query.find();

  records.map(async (r) => {
    if (r.get('ownerID')===undefined) {
      console.log('Fix needed for :',r.get('sentence'),' :: ',userID)
      r.set('ownerID',userID)
      await r.save();
    }
  });
  return
  const exportData = {
    exportedAt: new Date().toISOString(),
    records: records.map(buildJSNRecord),
  };

  const today = new Date().toISOString().slice(0,10),
        fileName = 'Uyum_BackUp_'+today;
  downLoadJSON(exportData, fileName);
} /* End of backUpTask */


function buildJSNRecord(r: Parse.Object) {
  const exported: Record<string, unknown> = {
    objectId: r.id,
    sentence: r.get('sentence'),
    order: r.get('order'),
  };

  const engTrans = r.get('engTrans');
  if ((engTrans!==undefined)&&engTrans.length) exported.engTrans = engTrans;
  const jpnTrans = r.get('jpnTrans');
  if ((jpnTrans!==undefined)&&jpnTrans.length) exported.jpnTrans = jpnTrans;
  const formalFlag = r.get('formalFlag');
  if ((formalFlag!==undefined)&&formalFlag) exported.formalFlag = true;
  const casualFlag = r.get('casualFlag');
  if ((casualFlag!==undefined)&&casualFlag) exported.casualFlag = true;

  return exported;
} /* End of buildJSNRecord */


function downLoadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
} /* End of downLoadJSON */


export default DataBackUp;
