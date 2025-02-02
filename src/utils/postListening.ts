
import { FormDataType } from "@/component/Examination/Listening/listening"
import { uploadMedia } from "@/utils/postRequest"
import { Lyrics } from "@mui/icons-material"


export class ListeningTest {
    form: any
    constructor() {
        this.form = {
            Listening: []
        }
    }
    async addAudio(File: any) {
        const form = new FormData()
        form.append('files', File)
        const audio_data = await uploadMedia(form)
        console.log(audio_data[0]);

        this.form.Listening.push({
            __component: "ielts-listening.audio-url",
            Url: audio_data[0].url

        })
        console.log(audio_data[0]);

    }
    async addImage(File: any) {
        const form = new FormData()
        form.append('files', File)
        const img_data = await uploadMedia(form)
        this.form.Listening.push({
            __component: "ielts-listening.img-url",
            url: img_data[0].url

        })
        console.log(img_data[0].url);

    }
    addQuestion(questionair: string) {
        this.form.Listening.push({
            __component: "ielts-listening.questionair",
            Questionaire: questionair
        })
    }
    addFilling(question: string, answer: any) {
        this.form.Listening.push({
            __component: "ielts-listening.filling",
            Question: question,
            Answer: answer
        })
    }
    addMultiplechoice(question: string, answer: string, choices: object) {
        this.form.Listening.push({
            __component: "ielts-listening.multiple-choice",
            Question: question,
            Answer: answer,
            Choices: {
                ...choices
            }
        })
    }

    removeQuestion(questionair: string) {
        this.form.Listening = this.form.Listening.filter(
            (item: any) => !(item.__component === "ielts-listening.questionair" && item.Questionaire === questionair)
        );
    }

    removeFilling(question: string) {
        this.form.Listening = this.form.Listening.filter(
            (item: any) => !(item.__component === "ielts-listening.filling" && item.Question === question)
        );
    }

    removeMultipleChoice(question: string) {
        this.form.Listening = this.form.Listening.filter(
            (item: any) => !(item.__component === "ielts-listening.multiple-choice" && item.Question === question)
        );
    }

    async addRelationTest(id: any) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_LINK_API_URL}/tests`);
        let data = await response.json();
        data = data.data;
        const test = data.filter((item: any) => item.id === id);
        if (test.length == 0) {
            console.log("There is no test with that id");
            return;
        }
        this.form['test'] = test[0];
    }

    async submitForm() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_LINK_API_URL}/listening-tests?populate=*`, {
            method: "POST",
            body: JSON.stringify({ data: this.form }),
            headers: {
                "Content-type": "application/json"
            }
        });
        const dt = await response.json();
        console.log(`${process.env.NEXT_PUBLIC_STRAPI_LINK_API_URL}/listening-tests?populate=*`,)
        return dt
    }

}

//khởi tạo object
const lt = new ListeningTest();

//nhận 1 string là paragraph

// nhận 1 string là questionair
lt.addQuestion('questionair 456');

// nhận 1 string là question, 1 string là answer
lt.addFilling('question 4444446', 'answer 123');

// nhận 1 string là question, 1 object theo định dạng bên dưới là các lựa chọn của câu hỏi, 1 string là đáp án của câu hỏi
lt.addMultiplechoice('multiple choice 123', 'B', {
    A: '1',
    B: '2',
    C: '3'
});


// nhận 1 số là id của test cần relate đến

// add theo thứ tự audio-> image(optional) -> questionair -> các questions -> audio(repeat same swquence) 
//-> ...., sau đó addRelation và cuối cùng là submit form
// lưu ý: đây là file ts nên muốn chạy cần import chạy ở component để test
// ở course/page.tsx có 1 component tên TestConnection, muốn chạy thử
// thì tắt comment đi để dùng


export const submitDataTests = async (formData: FormDataType) => {
    const isValidDate = (dateString: string) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    if (!isValidDate(formData.start_date) || !isValidDate(formData.end_date)) {
        alert("Ngày giờ không hợp lệ. Vui lòng nhập lại.");
        return 'false';
    }

    const isoStartDate = new Date(formData.start_date).toISOString();
    const isoEndDate = new Date(formData.end_date).toISOString();


    let dataToserver = {
        name: formData.name,
        Start: isoStartDate,
        End: isoEndDate,
        type: "Listening",
        Duration: formData.Duration,

    }
    console.log(dataToserver);
    const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_LINK_API_URL}/tests?filters[name][$eq]=${formData.name}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const checkData = await checkResponse.json();

    if (checkData.data.length > 0) {
        alert("Tên này đã tồn tại, vui lòng chọn tên khác.");
        return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_LINK_API_URL}/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            data: dataToserver
        }),
    })
    console.log(response);


    if (!response.ok) {
        throw new Error('Failed to upload test');
    }


}