import FormBox from "./FormBox";
import FormInput from "./FormInput";

type EventRecruitmentUrlInfoProps = {
  value: string;
  onChange: (nextValue: string) => void;
};

function EventRecruitmentUrlInfo({
  value,
  onChange,
}: EventRecruitmentUrlInfoProps) {
  return (
    <FormBox>
      <FormBox.Row label="모집 URL" required>
        <FormInput
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://"
          className="w-105"
        />
      </FormBox.Row>
    </FormBox>
  );
}

export default EventRecruitmentUrlInfo;
